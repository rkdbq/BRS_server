# coding = utf-8

from flask import Flask, render_template, request

import os, shutil, random, time, cv2, requests, psutil, threading

from argparse import Namespace
from model.UGATIT import UGATIT

app = Flask(__name__)
lock = threading.Lock()

@app.route('/')
def home():
    host_ip = requests.get("https://ipgrab.io/")
    return render_template('index.html', host_ip=host_ip.text)

@app.route('/inference', methods=['POST'])
def inference_selfie():
    if request.method == 'POST':
        # CPU 확인
        cpu_usage = psutil.cpu_percent(interval=1)
        if cpu_usage > 40:
            return render_template('load_balance.html')

        # 파일 이름 설정
        random.seed(int(time.time()))
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        randname = ''.join(random.choice(chars) for _ in range(30))
        filename = randname + '.jpg'

        input_file = f'static/inputs/{filename}'
        output_file = f'static/outputs/{filename}'
        resized_file = f'static/resized/{filename}'
        test_path = f'model/dataset/brs/{randname}/'

        # 모델 이미지 폴더 초기화
        os.mkdir(test_path)

        # 사용자 입력 이미지 저장
        f = request.files['file']
        f.save(input_file)

        # 모델 입력 이미지 폴더에 복사
        test_file = os.path.join(test_path, filename)
        shutil.copyfile(input_file, test_file)

        # 이미지 생성
        args = {
            'light': False,
            'dataset': 'brs',

            'iteration': 100000,
            'batch_size': 1,
            'print_freq': 1000,
            'save_freq': 100000,
            'decay_flag': True,

            'lr': 0.0001,
            'weight_decay': 0.0001,
            'adv_weight': 1,
            'cycle_weight': 10,
            'identity_weight': 10,
            'cam_weight': 1000,

            'ch': 64,
            'n_res': 4,
            'n_dis': 6,
            
            'img_size': 128,
            'img_ch': 3,

            'result_dir': 'brs_results',
            'device': 'cpu',
            'benchmark_flag': False,
            'resume': False,
        }

        args_ns = Namespace(**args)
        gan = UGATIT(args_ns)
        gan.build_model(test_dir=randname)
        gan.test(out_path=output_file)

        # 모델 이미지 폴더 초기화
        shutil.rmtree(test_path)

        return render_template('diff.html', input_img=f'inputs/{filename}', output_img=f'outputs/{filename}')
    
if __name__ == '__main__':
    app.run()