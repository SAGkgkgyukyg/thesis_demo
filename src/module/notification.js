let permission = Notification.permission;
if (permission === "granted") {
    showNotification();
} else if (permission === "default") {
    requestAndShowPermission();
}
// else {
//     alert("Use normal alert");
// }

export function showNotification() {
    if (document.visibilityState === "visible") {
        return "ok";
    }
    let title = "JavaScript Jeep";
    // icon = "image-url"
    let body = "Message to be displayed";
    // let notification = new Notification('Title', { body, icon });
    let notification = new Notification('Title', { body });
    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    }
}

export function requestAndShowPermission() {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            showNotification();
        }
    });
}