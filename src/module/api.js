const config = require("./config");
let blob_api_url = config["blob_api"]
let api_url = config["api"]

export const apiSignup = async (st_name, st_number) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "action": "signup",
        "st_name": st_name,
        "st_number": st_number
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = blob_api_url + "action=signup"
    // console.log(url)
    let st_id
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            st_id = data["st_id"]
            // var userid = JSON.parse(data);
            // console.log(userid);
            // return userid;
        })
        .catch(error => {
            st_id = "error"
        });
    // console.log(st_id)
    return st_id
}

export const Signin = async (account, password) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "account": account,
        "password": password
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let ans
    let url = api_url + "/login"
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data
        })
    // .catch(error => {
    //     console.log(error)
    // });
    // console.log(st_id)
    return ans
}




export const examinee_show = async (userid) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "userid": userid
    });
    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/examinee/show"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {

        });

    return ans
}


export const manager_examinee_show = async () => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url = api_url + "/manager/examinee_show"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {

        });

    return ans
}




export const manager_show = async () => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url = api_url + "/manager/show"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {

        });

    return ans
}

export const manager_add_examinee = async (name) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "st_number": name
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/add_examinee"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}

export const manager_add_exam = async (name) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "name": name
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/add_exam"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}


export const manager_change_examinee = async (userid, stnumber) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "user_id": userid,
        "st_number": stnumber
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/change_examinee"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}


export const manager_get_examinee = async (examid) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "examid": examid
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/get_examinee"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}


export const manager_get_all_examinee = async () => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    // let raw = JSON.stringify({
    //     "examid": examid
    // });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,

        redirect: 'follow'
    };
    let url = api_url + "/manager/get_all_examinee"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}



export const manager_get_examinee_all_imgs = async (examid, userid) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "examid": examid,
        "userid": userid
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/get_examinee_all_imgs"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}



export const manager_update_exam = async (examid, status) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "examid": examid,
        "status": status
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/update_exam"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}




export const manager_add_exam_student = async (examid, userid) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "examid": examid,
        "userid": userid
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/add_exam_student"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}


export const manager_start_ocr = async (examid) => {
    let myHeaders = {
        "Content-Type": "application/json"
    }
    let raw = JSON.stringify({
        "examid": examid,
    });

    let requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let url = api_url + "/manager/start_ocr"
    let ans
    await fetch(url, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ans = data["info"]
        })
        .catch(error => {
        });

    return ans
}




export const apiScreen = (image, st_id, st_number, examid) => {


    // const formData = new FormData();
    // formData.append('image', screen_blob);

    // let requestOptions = {
    //     method: "POST",
    //     headers: { "Access-Control-Allow-Origin": "*" },
    //     body: formData,
    // };


    // let url = "https://screen-api.azurewebsites.net/api/test-1115?code=WaXl2EH2iRInLhe6f6biewdzk4KCiFUP0eTK5fFLs5oMAzFuMRmdTA=="
    // let url = blob_api_url + "action=upload&st_id=" + st_id + "&st_number=" + st_number





    var formdata = new FormData();
    formdata.append("image", image);

    var requestOptions = {
        method: 'POST',
        headers: { "Access-Control-Allow-Origin": "*" },
        body: formdata,
        redirect: 'follow'
    };
    let url = blob_api_url + "st_id=" + st_id + "&st_number=" + st_number + "&examid=" + examid

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}