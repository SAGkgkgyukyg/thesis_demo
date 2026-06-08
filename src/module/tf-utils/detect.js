// import { Rank, Tensor, Tensor1D, Tensor2D, Tensor3D } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import * as renderbox from './renderBox';
import * as global from './global';
import labels from './labels.json';

const numClass = labels.length;
let animationId = -1;
let inputShape = [1, 640, 640, 3];

function preprocess(source, modelWidth, modelHeight) {
  let xRatio = 0;
  let yRatio = 0;

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);
    const [h, w] = img.shape.slice(0, 2);
    const maxSize = Math.max(w, h);
    const imgPadded = img.pad([
      [0, maxSize - h],
      [0, maxSize - w],
      [0, 0],
    ]);

    xRatio = maxSize / w;
    yRatio = maxSize / h;

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight])
      .div(255.0)
      .expandDims(0);
  });

  return [input, xRatio, yRatio];
}

export async function detect(source, canvasRef) {
  tf.engine().startScope();
  const [modelWidth, modelHeight] = inputShape.slice(1, 3);
  const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight);

  const res = global.model.net.execute(input);
  const transRes = res.transpose([0, 2, 1]);
  const boxes = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]);
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]);
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2));
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2));
    return tf.concat(
      [y1, x1, tf.add(y1, h), tf.add(x1, w)],
      2
    ).squeeze();
  });

  const [scores, classes] = tf.tidy(() => {
    const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze();
    return [rawScores.max(1), rawScores.argMax(1)];
  });

  const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.2);

  const boxes_data = await boxes.gather(nms, 0).data();
  const scores_data = await scores.gather(nms, 0).data();
  const classes_data = await classes.gather(nms, 0).data();

  renderbox.renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio]);
  // console.log(scores_data.length, classes_data.length);
  tf.dispose([res, transRes, boxes, scores, classes, nms]);
  tf.engine().endScope();
  let result = {
    "scores": Array.from(scores_data),
    "classes": Array.from(classes_data)
  }
  return result
}

export function detectVideo(vidSource, canvasRef) {
  const detectFrame = async () => {
    if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
      console.warn('vidSource.srcObject === null');
      const ctx = canvasRef.getContext('2d');
      ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    detect(vidSource, canvasRef, () => {
      animationId = requestAnimationFrame(detectFrame);
    });
  };

  detectFrame();
}

export function unDetectVideo() {
  console.warn('unDetectVideo');
  cancelAnimationFrame(animationId);
}
