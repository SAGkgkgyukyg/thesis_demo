from flask import Flask, render_template, send_from_directory, send_file, request, session, redirect, make_response
import os
import configparser
import log_dir
import cv2
from flask_cors import CORS, cross_origin
import numpy as np
import requests


app = Flask(__name__)
app.secret_key = "ucl_iid"

CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
# Config
config = configparser.ConfigParser()
config.read('set.conf', encoding="utf-8")
# Log
# LOGGING_FORMAT = '%(funcName)s-%(levelname)s-%(asctime)s-%(lineno)d-%(levelname)s: %(message)s:%(process)d'
# DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
# LOG_FILE = open('myLog.log', encoding="utf-8", mode="a")

# logging.basicConfig(level=logging.INFO, stream=LOG_FILE,
#                     datefmt=DATE_FORMAT, format=LOGGING_FORMAT)


# logging.debug('debug message')
# logging.info('info message')
# logging.warning('warning message')
# logging.error('error message')
# logging.critical('critical message')


@app.route("/")
def hello():
    account_cookie = request.cookies.get('account')
    if account_cookie == None:
        return redirect("/login")
    else:
        return render_template("main.html")


@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        data = request.json
        account = data["account"]
        url = str(config["Server"]["API"]) + "/login"
        response = requests.request("POST", url, headers={}, json=data)
        ans = response.json()
        if ans["status"] == "success":
            resp = make_response(ans)
            resp.set_cookie('account', account)
            resp.set_cookie('st_id', ans["st_id"])
            return resp
        else:
            resp = make_response(ans)
            return resp
    else:
        return render_template("login.html")


@app.route("/examinee/<string:module>")
def examinee_detect(module):
    # log_dir.print_info("test", 1, "hi")
    account_cookie = request.cookies.get('account')
    if account_cookie == None:
        return redirect("/login")
    else:
        return render_template("main.html")


@app.route("/examinee/show", methods=['POST'])
def examinee_get_all_exam():

    data = request.json
    url = str(config["Server"]["API"]) + "/examinee/show"
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    # print(ans)
    return ans


@app.route("/manager/<string:module>")
def manager(module):
    # log_dir.print_info("test", 1, "hi")
    account_cookie = request.cookies.get('account')
    if account_cookie == None:
        return render_template("login.html")
    else:
        return render_template("main.html")


@app.route("/manager/examinee_show", methods=['POST'])
def manager_examinee_show():
    url = str(config["Server"]["API"]) + "/manager/examinee_show"
    response = requests.request("POST", url, headers={}, data={})
    ans = response.json()
    return ans


@app.route("/manager/show", methods=['POST'])
def manager_show():
    url = str(config["Server"]["API"]) + "/manager/show"
    response = requests.request("POST", url, headers={}, data={})
    ans = response.json()
    # print(ans)
    return ans


@app.route("/manager/add_exam", methods=['POST'])
def manager_add_exam():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/add_exam"
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/add_examinee", methods=['POST'])
def manager_add_examinee():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/add_examinee"
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/change_examinee", methods=['POST'])
def manager_change_examinee():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/change_examinee"
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/get_examinee", methods=['POST'])
def manager_get_examinee():
    data = request.json
    # print(data["examid"])
    # return "a"
    url = str(config["Server"]["API"]) + "/manager/get_examinee"
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    print(ans)
    return ans


@app.route("/manager/get_all_examinee", methods=['POST'])
def manager_get_all_examinee():
    url = str(config["Server"]["API"]) + "/manager/get_all_examinee"
    response = requests.request("POST", url, headers={}, data={})
    ans = response.json()
    return ans


@app.route("/manager/get_examinee_all_imgs", methods=['POST'])
def manager_get_examinee_all_imgs():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/get_examinee_all_imgs"
    print(request.json)
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/update_exam", methods=['POST'])
def manager_update_exam():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/update_exam"
    print(request.json)
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/add_exam_student", methods=['POST'])
def manager_add_exam_student():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/add_exam_student"
    print(request.json)
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/start_ocr", methods=['POST'])
def manager_start_ocr():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/start_ocr"
    print(request.json)
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/manager/check_ocr", methods=['POST'])
def manager_check_ocr():
    data = request.json
    url = str(config["Server"]["API"]) + "/manager/check_ocr"
    print(request.json)
    response = requests.request("POST", url, headers={}, json=data)
    ans = response.json()
    return ans


@app.route("/robots.txt")
def robots_dot_txt():
    return "User-agent: *\nDisallow: /"


@app.route("/favicon/<string:pic>")
def favicon(pic):
    return send_from_directory(os.path.join(app.root_path, "static/images"),
                               pic, mimetype="image/favicon.ico")


@app.route("/static/images/<string:pic>")  # 動態圖片路徑
# @app.route("/static/")
def showpic(pic):
    return send_file("static/images/{}".format(pic))


@app.route('/models/<string:modelname>/<string:file>', methods=['GET'])
def yolo_file_tfjs(modelname, file):
    return send_file("./models/tfjs/{}/{}".format(modelname, file))


@app.route('/models/<string:model>', methods=['GET'])
def yolo_file_onnx(model):
    return send_file("./models/{}".format(model))


if __name__ == "__main__":

    ssl_crt_path = config["Server"]["CA"]
    ssl_key_path = config["Server"]["KEY"]
    host = config["Server"]["HOST"]
    port = config["Server"]["PORT"]
    # app.run(debug=False, host=str(host), port=port,
    #         ssl_context=(ssl_crt_path,  ssl_key_path))

    app.run(debug=True, host=str(host), port=port)
