import React, { useEffect, useRef, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import { detect } from "../../module/tf-utils/detect";
import { loadTfModels } from "../../module/tf-utils/actions";
import classes_name from "../../module/tf-utils/labels.json";
import * as global from "../../module/tf-utils/global";
import { detectImage } from "../../module/utils/detect";
import { InferenceSession } from 'onnxruntime-web';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Demo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [resultText, setResultText] = useState("尚未啟動偵測");
  const intervalRef = useRef(null);
  const [sourceType, setSourceType] = useState('screen'); // 'screen' or 'camera'
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [backendName, setBackendName] = useState('');
  const [backend, setBackend] = useState('tf/webgpu');
  const [ort_backend, setORTBackend] = useState('wasm');
  const [ortSession, setOrtSession] = useState(null);
  const ortSessionRef = useRef(null);
  const prevBackendRef = useRef(backend);
  const modelInputShape = [1, 3, 640, 640];
  const topk = 100;
  const iouThreshold = 0.4;
  const scoreThreshold = 0.7;
  const streamRef = useRef(null);

  const backend_table = [["tf/cpu", "TF/CPU"], ["tf/wasm", "TF/WASM"], ["tf/webgpu", "TF/WebGPU"], ["tf/webgl", "TF/WebGL"], ["ort/wasm", "ORT/WASM"], ["ort/cpu", "ORT/CPU"], ["ort/xnnpack", "ORT/XNNPACK"]];

  // 不在載入時自動啟動；改由使用者按 Start
  const startDetection = async () => {
    try {
      // 確保各種 backend 已被註冊（動態 import 可避免 module load order 問題）
      try {
        await Promise.all([
          import('@tensorflow/tfjs-backend-webgpu'),
          import('@tensorflow/tfjs-backend-webgl'),
          import('@tensorflow/tfjs-backend-wasm')
        ]);
      } catch (be) {
        console.warn('backend imports failed or not available', be);
      }
      // 根據使用者選擇的 engine 決定行為（同 detect.jsx）
      if (backend.slice(0, 2) === 'tf') {
        const tfSuffix = backend.split('/')[1];
        if (tfSuffix === 'cpu') {
          await tf.setBackend('cpu');
        } else if (tfSuffix === 'wasm') {
          await tf.setBackend('wasm');
        } else if (tfSuffix === 'webgl') {
          await tf.setBackend('webgl');
        } else if (tfSuffix === 'webgpu') {
          try {
            await tf.setBackend('webgpu');
            await tf.ready();
          } catch (e) {
            console.warn('webgpu init failed', e);
            window.alert('瀏覽器不支援 WebGPU 或初始化失敗，已停止啟動。請選擇其他後端（例如 TF/WebGL 或 ORT/WASM）。');
            return;
          }
        }
        setBackendName(tf.getBackend());
      } else {
        // ORT backend selection handled by ort_backend state; create session if needed
        if (!ortSessionRef.current) {
          try {
            setResultText('ORT 模型載入中...');
            const candidates = [
              './models/yolo_best.onnx',
              './models/onnx/yolo_best.onnx',
              '/models/yolo_best.onnx',
              '/models/onnx/yolo_best.onnx',
              'models/yolo_best.onnx',
              '../models/yolo_best.onnx'
            ];
            const nmsCandidates = [
              './models/nms-yolov8.onnx',
              './models/onnx/nms-yolov8.onnx',
              '/models/nms-yolov8.onnx',
              '/models/onnx/nms-yolov8.onnx',
              'models/nms-yolov8.onnx',
              '../models/nms-yolov8.onnx'
            ];

            let net = null;
            let nms = null;
            for (const url of candidates) {
              try {
                net = await InferenceSession.create(url, { executionProviders: [ort_backend] });
                console.info('ORT net loaded from', url);
                break;
              } catch (e) {
                console.warn('ORT load failed at', url, e.message || e);
              }
            }
            for (const url of nmsCandidates) {
              try {
                nms = await InferenceSession.create(url, { executionProviders: [ort_backend] });
                console.info('ORT nms loaded from', url);
                break;
              } catch (e) {
                console.warn('ORT nms load failed at', url, e.message || e);
              }
            }

            if (!net) throw new Error('Cannot load ORT net model from candidates');
            if (!nms) {
              // nms is optional depending on your pipeline; warn but continue
              console.warn('NMS model not found; continuing without dedicated NMS.');
            }

            const sessions = { net, nms };
            setOrtSession(sessions);
            ortSessionRef.current = sessions;
          } catch (e) {
            console.error('ORT session 建立失敗', e);
            setResultText('ORT session 建立失敗，請檢查 console');
            return;
          }
        }
      }
      // 若還沒呼叫 ready（在某些 fallback 分支），確保 readiness
      // 顯示當前後端：如果為 TF 類型顯示 tf.getBackend()，否則顯示 ORT backend
      let backendLabel = '';
      if (backend.slice(0, 2) === 'tf') {
        await tf.ready();
        backendLabel = tf.getBackend();
        setBackendName(backendLabel);
      } else {
        backendLabel = `ORT/${ort_backend}`;
      }
      setResultText(`後端：${backendLabel}，載入模型...`);
      if (!modelsLoaded) {
        await loadTfModels();
        setModelsLoaded(true);
      }

      // 取得影像來源
      let stream = null;
      if (sourceType === 'screen') {
        // 會跳出瀏覽器的選擇畫面，讓使用者選擇整個畫面、視窗或分頁
        stream = await navigator.mediaDevices.getDisplayMedia({ video: { width: 640, height: 640 }, audio: false });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640 }, audio: false });
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setRunning(true);
      setResultText('開始偵測中...');

      // 確保 backend 與模型完全 ready 後再啟動偵測迴圈
      await tf.ready();

      intervalRef.current = setInterval(async () => {
        try {
            // TF.js path
              if (backend.slice(0,2) === 'tf') {
            // 如果模型尚未載入或未初始化，跳過本次偵測
            if (!modelsLoaded || !global.model || !global.model.net) {
              await tf.ready();
              setResultText('等待模型載入...');
              return;
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.src = canvas.toDataURL('image/jpeg');
            await new Promise((res) => (img.onload = res));

            // 在每次偵測前確認 tf backend 已 ready，避免 race condition
            await tf.ready();
            const res = await detect(img, canvas);
            if (res && res['scores'] && res['scores'].length) {
              let s = '';
              for (let i = 0; i < res['scores'].length; i++) {
                s += `${classes_name[res['classes'][i]]} : ${Number(res['scores'][i]).toFixed(2)}\n`;
              }
              setResultText(s);
            } else {
              setResultText('未偵測到目標');
            }
          } else {
            // ORT path
            if (!ortSessionRef.current) {
              setResultText('等待 ORT session 建立...');
              return;
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.src = canvas.toDataURL('image/jpeg');
            await new Promise((res) => (img.onload = res));
            const res = await detectImage(img, canvas, ortSessionRef.current, topk, iouThreshold, scoreThreshold, modelInputShape);
            if (res && res['scores'] && res['scores'].length) {
              let s = '';
              for (let i = 0; i < res['scores'].length; i++) {
                s += `${classes_name[res['classes'][i]]} : ${Number(res['scores'][i]).toFixed(2)}\n`;
              }
              setResultText(s);
            } else {
              setResultText('未偵測到目標');
            }
          }
        } catch (e) {
          console.error(e);
          setResultText('偵測錯誤，查看 console');
        }
      }, 1000);

      // 當使用者手動停止分享（僅對 getDisplayMedia），監聽停止事件
      try {
        const tracks = stream.getVideoTracks();
        if (tracks && tracks[0]) {
          tracks[0].onended = () => {
            stopDetection();
            // 停止時清空推論結果
            setResultText('尚未啟動偵測');
          };
        }
      } catch (e) {
        // ignore
      }

    } catch (e) {
      console.error(e);
      setResultText('初始化失敗或使用者拒絕，請檢查權限與 console');
    }
  };

  const stopDetection = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      const tr = streamRef.current.getTracks();
      tr.forEach((t) => t.stop());
      streamRef.current = null;
    }
    // 停止偵測時清空或回復為預設提示，避免殘留推論結果
    setResultText('尚未啟動偵測');
  };

  return (
    <div>
      <h2>Demo 偵測 (選擇來源後按 Start 開始偵測)</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          <input type="radio" name="src" value="screen" checked={sourceType==='screen'} onChange={() => setSourceType('screen')} /> 螢幕擷取
        </label>
        <label>
          <input type="radio" name="src" value="camera" checked={sourceType==='camera'} onChange={() => setSourceType('camera')} /> 攝影機
        </label>
        <button style={{ marginLeft: 12 }} onClick={() => { if (!running) startDetection(); }} disabled={running}>Start</button>
        <button style={{ marginLeft: 8 }} onClick={() => { if (running) stopDetection(); }} disabled={!running}>Stop</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <FormControl disabled={running}>
          <FormLabel>當前推論引擎：{backend}</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={backend}
            onChange={async (event) => {
              const val = event.target.value;
              const prev = prevBackendRef.current;
              if (running) stopDetection();

              if (val.slice(0, 2) === 'tf') {
                const suffix = val.split('/')[1];
                try {
                  try {
                    await Promise.all([
                      import('@tensorflow/tfjs-backend-webgpu'),
                      import('@tensorflow/tfjs-backend-webgl'),
                      import('@tensorflow/tfjs-backend-wasm')
                    ]);
                  } catch (ie) {
                    // 某些後端可能無法 import，允許後續 setBackend 處理失敗
                  }
                  if (suffix === 'cpu') await tf.setBackend('cpu');
                  else if (suffix === 'wasm') await tf.setBackend('wasm');
                  else if (suffix === 'webgl') await tf.setBackend('webgl');
                  else if (suffix === 'webgpu') {
                    try {
                      await tf.setBackend('webgpu');
                      await tf.ready();
                    } catch (e) {
                      throw e;
                    }
                  }
                  await tf.ready();
                  setBackend(val);
                  prevBackendRef.current = val;
                  setBackendName(tf.getBackend());
                } catch (e) {
                  console.warn('setBackend failed or not supported', e);
                  window.alert(`瀏覽器不支援所選 TF 後端（${suffix}），請選擇其他後端。`);
                  setBackend(prev);
                  setBackendName('');
                  return;
                }
              } else {
                const ortSuffix = val.split('/')[1];
                if (ortSuffix === 'wasm') {
                  const wasmSupported = (typeof WebAssembly === 'object' || typeof WebAssembly === 'function');
                  if (!wasmSupported) {
                    window.alert('瀏覽器不支援 WebAssembly，無法使用 ORT/WASM，請選擇其他後端。');
                    setBackend(prev);
                    return;
                  }
                }
                setBackend(val);
                prevBackendRef.current = val;
                setORTBackend(ortSuffix);
              }
            }}
          >
            {backend_table.map((value, index) => (
              <FormControlLabel key={index} value={value[0]} control={<Radio />} label={value[1]} />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <video ref={videoRef} width={320} height={320} autoPlay playsInline muted style={{ border: '1px solid #ccc' }} />
          <canvas ref={canvasRef} width={640} height={640} style={{ display: 'none' }} />
        </div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{resultText}</pre>
      </div>
    </div>
  );
}
