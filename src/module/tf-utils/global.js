// import { isWebGPUSupported } from '../gpu';
import * as tf from '@tensorflow/tfjs';

import '@tensorflow/tfjs-backend-webgpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm'
// import * as tf from '@tensorflow/tfjs';
// tf.setBackend('cpu');

export let model = {
  net: null,
};
// export let inputShape = [1, 640, 640, 3];
// model configs
// export let modelName = 'yolov8s_iid';
export let tfjsLoading = { status: true };
export let tfjsProgress = { progress: 0 };
// export let tfjsSpinTip = () => {
//   return `Loading model... ${(tfjsProgress * 100).toFixed(2)}%`;
// };
// export let globalActiveKey = "1";


