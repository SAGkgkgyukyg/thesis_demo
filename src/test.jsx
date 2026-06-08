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
import My_snackbar from "./components/snackbar";
import * as webrtc from "./module/webrtc";
import * as ort from "./module/ort";
import "../static/style/App.css";
import * as tf from '@tensorflow/tfjs';

// import * as api from "./module/api";
// import * as notification from "./module/notification";
// import cv from "@techstark/opencv-js";
// import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
// import { download } from "./module/utils/download";
// import { detectImage } from "./module/utils/detect";

import { detect } from "./module/tf-utils/detect"
import { loadTfModels } from "./module/tf-utils/actions"
import classes_name from "./module/tf-utils/labels.json"

// const valid_st_number_str = new RegExp('/[A-z0-9]{10}/g')

function Main() {
  let canvas;
  let time = new Date().toLocaleString();
  const [cTime, setTime] = React.useState(time);
  const [record_flag, setFlagValue] = React.useState(false);
  const [st_number, setNumberValue] = React.useState("test");
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
  // const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState({ text: "Loading Model......", progress: null });
  const [image, setImage] = React.useState(null);
  const [inference_result, setinfer] = React.useState("");

  const imageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const resultRef = React.useRef(null);
  const capture_timer = useRef();

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
    if (!navigator.gpu) {
      tf.setBackend("webgl")
      console.log("WebGPU not supported.");
    } else {
      tf.setBackend("webgpu")
      console.log("WebGPU is supported ！！！")
    }

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



  }, [])
  useEffect(() => {
    //tf.js
    setLoading({ text: "Loading model...", progress: null });
    loadTfModels()
    setLoading(null)
    //wasm
    // cv["onRuntimeInitialized"] = async () => {
    //   const baseModelURL = `../models`;

    //   // create session
    //   const arrBufNet = await download(
    //     `${baseModelURL}/${modelName}`, // url
    //     ["Loading YOLOv8 model", setLoading] // logger
    //   );
    //   const yolov8 = await InferenceSession.create(arrBufNet);
    //   const arrBufNMS = await download(
    //     `${baseModelURL}/nms-yolov8.onnx`, // url
    //     ["Loading NMS model", setLoading] // logger
    //   );
    //   const nms = await InferenceSession.create(arrBufNMS);

    //   // warmup main model
    //   setLoading({ text: "Warming up model...", progress: null });
    //   const tensor = new Tensor(
    //     "float32",
    //     new Float32Array(modelInputShape.reduce((a, b) => a * b)),
    //     modelInputShape
    //   );
    //   await yolov8.run({ images: tensor });
    //   setSession({ net: yolov8, nms: nms });
    //   setLoading(null);
    // };
  }, [])
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

        // ort.run_model(
        //   canvasRef,
        //   canvasRef,
        //   session,
        //   topk,
        //   iouThreshold,
        //   scoreThreshold,
        //   modelInputShape)
        let url = await ort.create_image(video, canvas)
        imageRef.current.src = url
        setImage(url)
        // webrtc.snapshot(video, canvas);
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

  // const modelInputShape = [1, 3, 640, 640];
  // const modelName = "yolo_best.onnx";
  // const topk = 100;
  // const iouThreshold = 0.4;
  // const scoreThreshold = 0.7;



  return (
    <Grid container spacing={2}>
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
        <Card variant="outlined" sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography component="div" variant="h5">
              111-1 計算機概論 監考系統
              {/* Test */}
            </Typography>
            <Typography component="div" variant="h6">
              {cTime}
            </Typography>
            <Typography component="div" variant="h7">
              操作步驟
              <br />
              1. 填寫學號與姓名
              <br />
              2. 點選開始監考 *請選擇整個螢幕*
            </Typography>

            <br />

            <TextField
              required
              error={st_number != "" ? false : true}
              disabled={record_flag}
              id="outlined-basic"
              label="學號"
              variant="outlined"

              onChange={(e) => {
                setNumberValue(e.target.value);
              }}
            />
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
                if (record_flag == false) {
                  setMsgValue({
                    open: true,
                    serverity: "info",
                    message: "您尚未開始監考，請點選開始監考！"
                  });
                }
                {
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
            {/* <Button
              variant="contained"
              style={{ background: "blueviolet" }}
              onClick={() => {
                webrtc.snapshot(video, canvas);
              }}
            >
              進行截圖
            </Button> */}
          </CardActions>
        </Card>

        {/* <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          
          
        </ButtonGroup> */}
        {/* <Slider
          defaultValue={30}
          min={10}
          max={60}
          valueLabelDisplay="auto"
          onChange={setframerate}
        /> */}
      </Grid>
      <Grid item xs={8}>

        <h1>hello</h1>
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
          }}></div>
        {/* <Typography component="div" variant="h7">
          
        </Typography> */}

      </Grid>
      <Grid item xs={12}>
        {/* <Card sx={{ maxWidth: 1280, maxHeight: 720 }}>
        </Card> */}



      </Grid>
      <div className="content">
        <img
          ref={imageRef}
          src="#"
          alt=""
          // style={{ "display": "none" }}
          style={{ display: image ? "block" : "none" }}
          onLoad={async () => {

            // await detectImage(
            //   imageRef.current,
            //   canvasRef.current,
            //   session,
            //   topk,
            //   iouThreshold,
            //   scoreThreshold,
            //   modelInputShape
            // );

            let result = await detect(
              imageRef.current,
              canvasRef.current
            )
            if (result["scores"].length != 0) {
              let ans = ""
              for (let i = 0; i < result["scores"].length; i++) {
                ans = ans + "<br />" + classes_name[result["class"][i]] + ' 之信心值為 ' + result["scores"][i]
              }
              setinfer(inference_result + "<br />---------------------------------------<br />" + cTime + ans)
              resultRef.current.scrollTop = resultRef.current.scrollHeight;

            }

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
        // ref={videoRef}
        // onPlay={async () => {
        //   await detect(
        //     video.current,
        //     canvasRef.current
        //   )
        // }}
        />

      </Grid>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
    </Grid>
  );
}
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Main />);
