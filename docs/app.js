const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');
const infoEl = document.getElementById('info');
const modelSelect = document.getElementById('modelSelect');

let stream = null;
let rafId = null;
let tfModel = null;
let onnxSession = null;
let running = false;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
    video.srcObject = stream;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    running = true;
    drawLoop();
  } catch (e) {
    alert('無法啟用相機: ' + e.message);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  startBtn.disabled = false;
  stopBtn.disabled = true;
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
}

function drawLoop() {
  if (!running) return;
  ctx.clearRect(0,0,overlay.width,overlay.height);
  // draw a faint crosshair
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeRect(0,0,overlay.width,overlay.height);
  // capture and run inference occasionally
  rafId = requestAnimationFrame(drawLoop);
}

startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);

loadBtn.addEventListener('click', async () => {
  const choice = modelSelect.value;
  statusEl.textContent = '載入中...';
  try {
    if (choice === 'tfjs') {
      const modelUrl = './models/tfjs/yolov8s_iid/model.json';
      tfModel = await tf.loadGraphModel(modelUrl);
      statusEl.textContent = 'TFJS 模型已載入';
      infoEl.textContent = 'TFJS model: ' + modelUrl;
      startInferLoop('tfjs');
    } else {
      const modelUrl = './models/onnx/yolo_best.onnx';
      onnxSession = await ort.InferenceSession.create(modelUrl);
      statusEl.textContent = 'ONNX 模型已載入';
      infoEl.textContent = 'ONNX model: ' + modelUrl;
      startInferLoop('onnx');
    }
  } catch (e) {
    statusEl.textContent = '載入失敗: ' + e.message;
  }
});

let inferTimer = null;
function startInferLoop(kind) {
  if (inferTimer) clearInterval(inferTimer);
  inferTimer = setInterval(async () => {
    if (!video || video.readyState < 2) return;
    try {
      // capture to canvas
      const tmp = document.createElement('canvas');
      tmp.width = 640; tmp.height = 480;
      const tctx = tmp.getContext('2d');
      tctx.drawImage(video, 0, 0, tmp.width, tmp.height);
      const imgData = tctx.getImageData(0,0,tmp.width,tmp.height);

      const t0 = performance.now();
      if (kind === 'tfjs' && tfModel) {
        const img = tf.browser.fromPixels(imgData).toFloat().div(255).expandDims(0);
        const res = await tfModel.executeAsync(img);
        tf.dispose(img);
        // we won't try to parse YOLO outputs here; just show timing
        const t1 = performance.now();
        infoEl.textContent = `TFJS 推論: ${(t1-t0).toFixed(1)} ms`;
      } else if (kind === 'onnx' && onnxSession) {
        const tensor = new ort.Tensor('float32', preprocessToFloat32(imgData), [1,3,480,640]);
        const feeds = {};
        // try common input name
        const inputName = onnxSession.inputNames[0];
        feeds[inputName] = tensor;
        const output = await onnxSession.run(feeds);
        const t1 = performance.now();
        infoEl.textContent = `ONNX 推論: ${(t1-t0).toFixed(1)} ms`;
      }
    } catch (e) {
      infoEl.textContent = '推論錯誤: ' + e.message;
    }
  }, 500);
}

function preprocessToFloat32(imageData) {
  // imageData: RGBA uint8
  const w = imageData.width, h = imageData.height;
  const data = imageData.data;
  const out = new Float32Array(3 * w * h);
  // convert to CHW float32 and normalize to [0,1]
  for (let i=0;i<w*h;i++){
    out[i] = data[i*4] / 255.0; // R
    out[w*h + i] = data[i*4+1] / 255.0; // G
    out[2*w*h + i] = data[i*4+2] / 255.0; // B
  }
  return out;
}

window.addEventListener('beforeunload', () => {
  stopCamera();
  if (inferTimer) clearInterval(inferTimer);
});

// Helpful note if models are missing
if (typeof tf === 'undefined' || typeof ort === 'undefined') {
  console.warn('TFJS or ONNX Runtime not loaded — index.html should include CDN scripts.');
}
