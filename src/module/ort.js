export const create_image = async (video, canvas) => {
    canvas.width = 1920;
    canvas.height = 1080;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    let screen_blob = dataURLtoBlob(canvas.toDataURL())
    // console.log(video)
    // api.apiScreen(st_id, st_number, screen_blob)
    // storage(st_id, st_number)
    // save(screen_blob) //儲存截圖
    canvas.width = 640;
    canvas.height = 640;
    return {
        "url": URL.createObjectURL(new File([screen_blob], "name.jpeg")),
        "blob": screen_blob
    }
    // return URL.createObjectURL(new File([screen_blob], "name.jpeg"))
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