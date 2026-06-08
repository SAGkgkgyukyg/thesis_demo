import React from "react";
import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import My_snackbar from "../snackbar";
import MuiAlert from '@mui/material/Alert';


import Toolbar from '@mui/material/Toolbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import * as webrtc from "../../module/webrtc";
import * as ort from "../../module/ort";
import "../../../static/style/App.css";
import * as tf from '@tensorflow/tfjs';

// import * as api from "./module/api";
// import * as notification from "./module/notification";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { download } from "../../module/utils/download";
import { detectImage } from "../../module/utils/detect";

import Loader from "../loader";
import { detect } from "../../module/tf-utils/detect"
import { loadTfModels } from "../../module/tf-utils/actions"
import classes_name from "../../module/tf-utils/labels.json"
import ExcelJS from 'exceljs';
import config, { allow } from "../../module/config.js"
// const valid_st_number_str = new RegExp('/[A-z0-9]{10}/g')



// const mode = "onnx"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Main({ show, examid, examname, st_id, st_number }) {
  let canvas;
  let time = new Date().toLocaleString();
  const [cTime, setTime] = React.useState(time);
  const [record_flag, setFlagValue] = React.useState(false);
  // const [st_number, setNumberValue] = React.useState("test");
  // const [st_name, setNameValue] = React.useState("test");
  // const [st_id, setIDValue] = React.useState("");
  // const [open, setOpen] = React.useState(false);
  const [notifi_msg, setMsgValue] = React.useState({
    open: true,
    serverity: "info",
    message: "請填寫學號與姓名，並點選開始監考！"
  });
  const [stream, setStream] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState({ text: "Loading Model......", progress: null });
  const [image, setImage] = React.useState(null);
  const [blob, setBlob] = React.useState(null);
  const [inference_result, setinfer] = React.useState("");
  const [backend, setBackend] = React.useState("tf/webgpu");
  const imageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const resultRef = React.useRef(null);
  const capture_timer = useRef();
  const backend_table = [["tf/cpu", "TF/CPU"], ["tf/wasm", "TF/WASM"], ["tf/webgpu", "TF/WebGPU"], ["tf/webgl", "TF/WebGL"],
  ["ort/wasm", "ORT/WASM"], ["ort/cpu", "ORT/CPU"], ["ort/xnnpack", "ORT/Xnnpack"]]
  // const [mode, setMode] = React.useState("tfjs");
  const [ort_backend, setORTBackend] = React.useState("wasm");

  const [count, setCount] = React.useState(1)
  const [result, setResult] = React.useState([])


  const createExcelFile = (arrayData, backend_name) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('sheet 1');

    // 設定 A1 儲存格的名稱為 "花費時間"
    worksheet.getCell('A1').value = '花費時間';

    // 設定 B1 儲存格的名稱為 "使用之推論引擎"
    worksheet.getCell('B1').value = '使用之推論引擎';

    // 陣列資料
    // const arrayData = ['資料1', '資料2', '資料3', '資料4'];

    // 將陣列資料加入 A 欄位下的儲存格
    arrayData.forEach((data, index) => {
      const cell = worksheet.getCell(`A${index + 2}`);
      cell.value = data;
    });

    // 字串資料
    // const stringData = '這是一個字串資料';

    // 將字串資料加入 B 欄位下的儲存格
    worksheet.getCell('B2').value = backend_name;

    // 將工作表儲存為 Excel 檔案
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${Date.now()}_${backend}_inference_result.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const MyRadio =
    (
      <FormControl
        disabled={record_flag}
      >
        <FormLabel color="primary">當前推論引擎：{backend}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={
            (event) => {
              // console.log(event.target.value)
              setBackend(event.target.value)
              if (event.target.value.slice(0, 2) == "tf") {

                if (event.target.value.slice(3) == "cpu") {
                  tf.setBackend("cpu")
                } else if (event.target.value.slice(3) == "wasm") {
                  tf.setBackend("wasm")
                } else if (event.target.value.slice(3) == "webgl") {
                  tf.setBackend("webgl")
                } else if (event.target.value.slice(3) == "webgpu") {
                  tf.setBackend("webgpu")
                }
              } else {
                if (event.target.value.slice(4) == "cpu") {
                  setORTBackend("cpu")
                } else if (event.target.value.slice(4) == "wasm") {
                  setORTBackend("wasm")
                } else if (event.target.value.slice(4) == "xnnpack") {
                  setORTBackend("xnnpack")
                }
              }
            }
          }
        >
          {
            backend_table.map((value, index) => (
              <FormControlLabel key={index} value={value[0]} control={<Radio />} label={value[1]} />
            ))
          }
        </RadioGroup>
      </FormControl>
    )




  // const valid_st_number = () => {
  //   if (valid_st_number_str.test()) {
  //     console.log("current")
  //   } else {
  //     console.log("error")
  //   }
  // }

  // let show_case = {
  //   "img": true,
  //   "canva": true,
  //   "video": false
  // }


  let time_count = setInterval(() => {
    time = new Date().toLocaleString();
    setTime(time);
  }, 1000);



  useEffect(() => {
    // console.log(mode)
    if (!navigator.gpu) {
      try {
        var canvas = document.createElement('canvas');
        if (!!window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) {
          tf.setBackend("webgl")
          console.log("WebGPU not supported.");
          setBackend("webgl")
        }
      } catch (e) {
        tf.setBackend("wasm")
        setBackend("wasm")
        console.log("WebGPU、WebGL not supported.");
      }
    } else {
      tf.setBackend("webgpu")
      console.log("WebGPU is supported ！！！")
      setBackend("tf/webgpu")
      try {
        let adapter = navigator.gpu.requestAdapter();
        if (!adapter) {
          // throw Error("Couldn't request WebGPU adapter.");
          console.log("Couldn't request WebGPU adapter.")
        } else {
          console.log("WebGPU adapter get！！！")
        }
      } catch (e) {
        console.log(e)
      }
    }
    console.log("This browser is using", tf.getBackend())
  }, [])
  useEffect(() => {
    //tf.js
    // setLoading({ text: "Loading tfjs model...", progress: null });
    if (show == true) {
      loadTfModels()
      setLoading({ text: "loading up model...", progress: 80 });
      setLoading(null);
    }

  }, [show])

  useEffect(() => {
    //tf.js
    // setLoading({ text: "Loading tfjs model...", progress: null });
    // loadTfModels()
    // setLoading(null)
    //wasm
    // if(ort_backend=="")
    cv["onRuntimeInitialized"] = async () => {
      const baseModelURL = `../models`;

      // create session
      // const arrBufNet = await download(
      //   `${baseModelURL}/${modelName}`, // url
      //   ["Loading onnx model", setLoading] // logger
      // );
      // const yolov8 = await InferenceSession.create(arrBufNet);
      const yolov8 = await InferenceSession.create("../models/yolo_best.onnx",
        {
          executionProviders: [ort_backend],
        }
      );
      //cpu、wasm、xnnpack is ok
      //cuda、webgl not ok
      const arrBufNMS = await download(
        `${baseModelURL}/nms-yolov8.onnx`, // url
        ["Loading NMS model", setLoading] // logger
      );
      // const nms = await InferenceSession.create(arrBufNMS);
      const nms = await InferenceSession.create("../models/nms-yolov8.onnx",
        {
          executionProviders: [ort_backend],
        });
      // warmup main model
      setLoading({ text: "Warming up model...", progress: null });
      const tensor = new Tensor(
        "float32",
        new Float32Array(modelInputShape.reduce((a, b) => a * b)),
        modelInputShape
      );

      await yolov8.run({ images: tensor });
      setSession({ net: yolov8, nms: nms });
      setLoading(null);


    };
  }, [ort_backend])


  useEffect(() => {
    if (show == false) {
      setResult([])
      setCount(0)
      if (record_flag == false) {
        setMsgValue({
          open: true,
          serverity: "info",
          message: "您尚未開始監考，請點選開始監考！"
        });
      } else {
        record(false);
        webrtc.stop(video);
        setMsgValue({
          open: true,
          serverity: "warning",
          message: "已停止監考，請確認是否已經完成作答！"
        });
      }
    }
  }, [show]);


  useEffect(() => {
    setVideo(document.getElementById("video"))
    canvas = document.getElementById("canvas");
  });

  useEffect(() => {
    if (!record_flag) {
      console.log("not record");

      try {
        clearInterval(capture_timer.current);
      } catch (e) {
        console.log(e);
      }
    } else {
      setMsgValue({
        open: true,
        serverity: "success",
        message: "已開始監考，請全力作答！"
      });
      capture_timer.current = setInterval(async () => {
        if (image) {
          URL.revokeObjectURL(image);
          setImage(null);
        }
        let result = await ort.create_image(video, canvas)
        setBlob(result["blob"])
        imageRef.current.src = result["url"]
        setImage(result["url"])
      }, 1000);
      // notification.showNotification();
    }
  }, [record_flag]);

  const handle_notiClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
    setMsgValue({
      open: false,
      serverity: notifi_msg["serverity"],
      message: notifi_msg["message"]
    });
  };

  const record = (newValue) => {
    setFlagValue(newValue);
  };



  const modelInputShape = [1, 3, 640, 640];
  const modelName = "yolo_best.onnx";
  const topk = 100;
  const iouThreshold = 0.4;
  const scoreThreshold = 0.7;



  return (

    <Grid container spacing={2}
      style={{ display: show ? "" : "none" }} >
      {loading && (
        <Loader>
          {loading.progress ? `${loading.text} - ${loading.progress}%` : loading.text}
        </Loader>
      )}

      <My_snackbar
        // handle_Close={handle_notiClose}
        open={notifi_msg["open"]}
        severity={notifi_msg["serverity"]}
        message={notifi_msg["message"]}
      ></My_snackbar>
      <Grid item xs={4}>
        {/* <Button variant="contained" href="/">主頁面</Button> */}
        {/* <Toolbar /> */}
        <Card variant="outlined" sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography component="div" variant="h6">
              {cTime}
            </Typography>

            <Typography component="div" variant="h7">
              考試場次ID：{examid}
              <br />
              考試場次名稱：{examname}
              <br />
              {/* <br />

              操作步驟
              <br />
              1. 填寫學號
              <br />
              2. 點選開始監考 *請選擇整個螢幕* */}
            </Typography>
            {MyRadio}
            {/* <Typography variant="subtitle1" gutterBottom>
              當前推論後端：{backend}
            </Typography> */}
            <br />

            {/* <TextField
              required
              error={st_number != "" ? false : true}
              disabled={record_flag}
              id="outlined-basic"
              label="學號"
              variant="outlined"

              onChange={(e) => {
                setNumberValue(e.target.value);
              }}
            /> */}
            
            <br />
            <br />
            {/* <TextField
              required
              error={st_name != "" ? false : true}
              disabled={record_flag}
              id="outlined-basic"
              label="姓名"
              variant="outlined"
              onChange={(e) => {
                setNameValue(e.target.value);
              }}
            /> */}
          </CardContent>
          <CardActions>
            <Button
              disabled={record_flag}
              variant="contained"
              onClick={async () => {

                console.log(st_number)
                if (st_number == "") {
                  console.log("no name 、 number or wrong number");
                  setMsgValue({
                    open: true,
                    serverity: "warning",
                    message: "學號跟姓名都要輸入喔！"
                  });
                } else {
                  let screen = await webrtc.capture(video)
                  setStream(screen["stream"])
                  if (screen["msg"] == "ok") {
                    // sessionStorage.removeItem("data");
                    screen["stream"].getVideoTracks()[0].onended = () => {
                      console.log("手動停止");
                      setCount(0)
                      record(false);
                      webrtc.stop(video);
                      setMsgValue({
                        open: true,
                        serverity: "warning",
                        message: "已停止監考，請確認是否已經完成作答！"
                      });
                    };
                    // ort.main()
                    // await api
                    //   .apiSignup(st_name, st_number)
                    //   .then((data) => {
                    //     setIDValue(data);
                    //   });
                    record(true);
                    if (backend.slice(0, 2) == "tf") {
                      console.log("Now is using", String(tf.getBackend()))
                    } else {
                      console.log("Now is using ORT")
                    }

                  } else {
                    setMsgValue({
                      open: true,
                      serverity: "error",
                      message: "請重新點選開始監考並選擇*整個螢幕*！"
                    });
                  }
                }

              }}
            >
              開始監考
            </Button>
            <Button
              disabled={!record_flag}
              variant="contained"
              style={{ background: "crimson" }}
              onClick={() => {
                setResult([])
                setCount(0)
                if (record_flag == false) {
                  setMsgValue({
                    open: true,
                    serverity: "info",
                    message: "您尚未開始監考，請點選開始監考！"
                  });
                } else {
                  record(false);
                  webrtc.stop(video);
                  setMsgValue({
                    open: true,
                    serverity: "warning",
                    message: "已停止監考，請確認是否已經完成作答！"
                  });
                }
              }}
            >
              停止監考
            </Button>

          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={8}>
        檢測結果如下👇
        <div
          ref={resultRef}
          style={{
            overflow: "auto",
            maxHeight: "300px",
            // maxWidth: "250px"
          }}
          dangerouslySetInnerHTML={{
            __html: inference_result
          }}
        >
        </div>
      </Grid>

      <div className="content">
        <img
          ref={imageRef}
          src="#"
          alt=""
          // style={{ "display": "none" }}
          style={{ display: image ? "block" : "none" }}
          onLoad={async () => {
            const process = (result) => {
              if (result["scores"].length != 0) {
                let ans = ""
                for (let i = 0; i < result["scores"].length; i++) {
                  /// 上傳截圖
                  if (!(config.allow.includes(result["classes"][i]))) {
                    webrtc.snapshot(blob, st_id, st_number, examid)
                  }
                  ans = ans + "<br />" + classes_name[result["classes"][i]] + ' 之信心值為 ' + String(Math.round((parseFloat(result["scores"][i]) + Number.EPSILON) * 100) / 100)
                }
                setinfer(inference_result + "<br />---------------------------------------<br />"
                  + cTime + "<br />"
                  + backend
                  + ans)
                resultRef.current.scrollTop = resultRef.current.scrollHeight;
              }
            }

            let start = 0
            let end = 0

            start = new Date().getTime()
            if (backend.slice(0, 2) == "tf") {
              let result = await detect(
                imageRef.current,
                canvasRef.current
              )
              end = new Date().getTime();
              process(result)
            } else {
              let result = await detectImage(
                imageRef.current,
                canvasRef.current,
                session,
                topk,
                iouThreshold,
                scoreThreshold,
                modelInputShape
              );
              end = new Date().getTime();
              process(result)
            }



            // exp_log
            // console.log(count)
            // if ((count % 20) == 0 && count <= 400) {
            //   console.log("Stop it. Get some help.")
            //   createExcelFile(result, backend)
            //   setResult([])
            //   // setCount(0)

            // } else if (count == 401) {
            //   record(false);
            //   webrtc.stop(video);
            //   setCount(0)
            //   setMsgValue({
            //     open: true,
            //     serverity: "warning",
            //     message: "已停止監考，請確認是否已經完成作答！"
            //   });
            // }
            // setCount(count + 1)
            // setResult((prevResult) => [...prevResult, (end - start) / 1000])
            // exp_log

          }}
        />
        <canvas id="canvas"
          // style={{ "display": "none" }}
          ref={canvasRef}
          // width={modelInputShape[2]}
          // height={modelInputShape[3]}
          width={640}
          height={640}
        />
      </div>
      <Grid item xs={6}>
        <video
          id="video"
          style={{ "display": "none" }}
        />
      </Grid>
    </Grid>
  );
}
// const container = document.getElementById("root");
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<Main />);
