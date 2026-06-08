let stream
import * as api from "./api"
const config = require("./config");
export const get_user_media = () => {
    console.log("test")
}


export const snapshot = (image, st_id, st_number, examid) => {
    // canvas.width = 640;
    // canvas.height = 640;
    // let ctx = canvas.getContext("2d");
    // ctx.drawImage(video, 0, 0);
    // let screen_blob = dataURLtoBlob(canvas.toDataURL())
    // console.log(video)
    // console.log(image)

    api.apiScreen(image, st_id, st_number, examid)//0630儲存截圖至azure blob by serverless
    // storage(st_id, st_number)
    // save(image, st_id, st_number) //0702 儲存截圖至fileserver
};

function save(fileData, st_id, st_number) {
    // 建立一個新的 Blob 物件
    // const fileData = new Blob(["Hello, World!"], { type: "text/plain" });

    // 建立一個 FormData 物件，用於包裝要 POST 的資料
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    const formData = new FormData();
    // console.log(fileData)
    const sou = "{'st_id':'" + String(st_id) + "','st_number':'" + String(st_id) + "'}.jpg"
    formData.append("file", fileData, sou); // 將 Blob 檔案加入到 FormData 中，並指定檔名
    // formData.append("file", fileData, "a.jpg"); // 將 Blob 檔案加入到 FormData 中，並指定檔名
    // formData.append("st_id", st_id)
    // formData.append("st_number", st_number)
    console.log(formData)
    // 建立一個 XMLHttpRequest 物件
    let xhr = new XMLHttpRequest();
    // 設定 POST 請求的 URL
    // const url = "https://ucl-iid.54ucl.com:8888/upload"; // 請將 URL 替換為您的伺服器端點
    const url = config["blob_api"]; // 請將 URL 替換為您的伺服器端點

    // 設定 POST 請求的回呼函式


    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log(String(timestamp) + "圖片檔案上傳成功！");
            } else {
                console.error("檔案上傳失敗。");
            }
        }
    };

    // 開始發送 POST 請求
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send(formData);

}

function storage(st_id, st_number) {
    console.log("set!")
    let data = {
        time: st_id,
        file_name: st_number
    }
    if (!sessionStorage.getItem("data")) {
        console.log("first")
        sessionStorage.setItem('data', "[" + JSON.stringify(data) + "]")
    } else {
        let data = JSON.parse(sessionStorage.getItem('data'))
        data.push({ test: "aaa" })
        sessionStorage.setItem('data', JSON.stringify(data))
        console.log(JSON.parse(sessionStorage.getItem("data")).length)
        // console.log(typeof (data))
    }
    let limit = 1024 * 1024 * 5; // 5 MB
    let remSpace = limit - unescape(encodeURIComponent(JSON.stringify(sessionStorage))).length;
    console.log(remSpace)
}

function dataURLtoBlob(dataURL) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURL.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

}
export const capture = async (video) => {
    console.log("開始擷取")
    console.log(navigator);
    console.log(navigator.platform);
    let option = {
        video: {
            frameRate: 1,
            displaySurface: "monitor",
            logicalSurface: false,
            encoding: "AVC/H.264",
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 }
        },
        selfBrowserSurface: "exclude"
    }
    if (navigator.appVersion) {
        if (navigator.appVersion.includes("Safari")) {
            option = {
                video: {
                    frameRate: 1,
                    encoding: "AVC/H.264",
                }
            }
        }
    }



    // let option = {
    //     video: true
    // }

    // if (navigator.mediaDevices.getDisplayMedia) {
    //     // let source
    //     navigator.mediaDevices.getDisplayMedia(option).then("success").catch(error);

    // }

    let screen = await navigator.mediaDevices.getDisplayMedia(option)
        .then((source) => {
            console.log(source)

            //避免選擇非全螢幕
            // let displaySurface = source.getVideoTracks()[0].getSettings().displaySurface;
            // if (displaySurface != "monitor") {
            //     console.log("not monitor")
            //     source.getVideoTracks()[0].stop()
            //     console.log(source.getVideoTracks())
            //     throw "Selection Error!!!"
            // } else {
            //     // console.log(source.getVideoTracks())
            //     video.srcObject = source;
            //     console.log(video.srcObject)
            //     video.play();
            //     stream = source
            //     let a = new ImageCapture(source.getVideoTracks()[0])
            //     return "ok"
            // }
            // const video = document.getElementById("video")
            video.srcObject = source;
            video.play();
            stream = source
            return "ok"
        })
        .catch((err) => {
            // console.error(`Error:${err}`)
            console.log('error', err)
            return "error"
        });


    return { "msg": screen, "stream": stream }
    // console.log(video)
}

export const stop = async (video) => {
    console.log("停止擷取")
    // console.log(stream.getVideoTracks()[0].getSettings())
    try { stream.getVideoTracks()[0].stop() }
    catch (e) {
        console.log(e)
    }
}

export const set_framerate = async (framerate) => {
    console.log("now framerate is:", framerate)
    const my_mediastream = stream.getVideoTracks()[0]
    // console.log(a[0].getSettings()["frameRate"])
    let option = {
        video: { frameRate: { ideal: framerate, max: framerate + 5 } },
    }
    console.log(navigator.mediaDevices.getSupportedConstraints())
    // await navigator.mediaDevices.getDisplayMedia(option)
    //     .then((a) => {
    //         console.log("success")
    //         video.srcObject = a;
    //         video.play();
    //         stream = a
    //     })
    //     .catch((err) => {
    //         // console.error(`Error:${err}`)
    //         console.log('error', err)
    //         return null
    //     });
    // console.log(my_mediastream)
    // await my_mediastream.applyConstraints(option)
    // const p = new Promise((resolve, reject) => {
    //     my_mediastream.applyConstraints(option)
    //         .then(() => {
    //             // console.log(stream.getVideoTracks[0].getSettings()["framerate"])
    //             console.log("ok")
    //             resolve("ok")
    //         })
    //         .catch((e) => {
    //             console.log("not working", e)
    //             reject("not ok")
    //         })
    // })

    console.log(my_mediastream.getSettings())
}