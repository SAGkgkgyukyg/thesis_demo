import time
import os
import logging
from logging.handlers import TimedRotatingFileHandler

logger = logging.getLogger()


def set_file(filename):
    os.getcwd()
    handler = TimedRotatingFileHandler(filename, 'D', 1, 7)
    fmt = '%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s'
    formatter = logging.Formatter(fmt=fmt, datefmt='%m/%d/%Y %H:%M:%S')
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)
    # 屏幕输出
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    console.setLevel(logging.INFO)
    logger.addHandler(console)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


def print_info(info, *args):
    # createLogFile("info", logging.INFO)
    if len(args) > 0:
        log = ""
        for arg in args:
            log += "{}"
        logger.info((info + log).format(*args))
    else:
        logger.info(info)


rq = time.strftime('%Y-%m-%d', time.localtime(time.time()))
# print(rq)
log_name = os.getcwd() + '/Logs/' + rq + '.log'
set_file(log_name)
