import * as tf from '@tensorflow/tfjs';
import * as global from './global';


// let tfjsLoading = true
// let tfjsProgress = 0
let modelName = 'yolov8s_iid';

// console.log(global)
export async function loadTfModels() {
  await tf.ready();
  const candidates = [
    `./models/${modelName}/model.json`,
    `/models/${modelName}/model.json`,
    `models/${modelName}/model.json`,
    `../models/${modelName}/model.json`
  ];

  let yolov8 = null;
  for (const url of candidates) {
    try {
      yolov8 = await tf.loadGraphModel(url, {
        onProgress: (fractions) => {
          global.tfjsLoading.status = true;
          global.tfjsProgress.progress = fractions;
        }
      });
      console.info('TFJS model loaded from', url);
      break;
    } catch (e) {
      console.warn('TFJS load failed at', url, e.message || e);
    }
  }

  if (!yolov8) throw new Error('Failed to load TFJS model from candidate paths');

  if (yolov8.inputs && yolov8.inputs[0] && yolov8.inputs[0].shape) {
    const dummyInput = tf.ones(yolov8.inputs[0].shape);
    const warmupResults = yolov8.execute(dummyInput);
    global.tfjsLoading.status = false;
    global.tfjsProgress.progress = 1;
    global.model.net = yolov8;
    tf.dispose([warmupResults, dummyInput]);
  }
}

export function initNet() {
  tf.disposeVariables();
}