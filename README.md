# BRS_server
in Lec. CloudComputing

`efs`에 적재되는 서버 코드입니다.

```bash
# Tree
home
└── efs
    └── serve_code
        ├── model
        │   ├── assets
        │   ├── brs_results
        │   │   └── brs
        │   │       ├── img
        │   │       └── model
        │   │           └── brs_params_0100000.pt
        │   └── dataset
        │       └── brs
        │           └── FOR_INFERENCE_FOLDER
        ├── static
        │   ├── inputs
        │   └── outputs
        └── templates
```

# Model
- [U-GAT-IT Pytorch](https://github.com/znxlwm/UGATIT-pytorch)

# Data
- BlackRubberShoes Dataset (in Google Drive) ([Source](https://www.youtube.com/playlist?list=PLrNFl43wt6gCEdWfQjzPf2Dnza7liRcpL))
- [All-Age-Faces-Dataset](https://github.com/JingchunCheng/All-Age-Faces-Dataset)
- Weight File (in Google Drive)

# EC2 Template User Data
for Load Balancing, Auto Scaling
```bash
#!/bin/bash
yum update -y
yum install -y amazon-efs-utils

echo "mount"
mkdir /home/ec2-user/efs
mount -t efs -o tls [YOUR_EFS_ADDR] /home/ec2-user/efs

yum install -y mesa-libGL

echo "env init"
su - ec2-user
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip3 install flask opencv-python scipy gunicorn psutil

export PATH=$PATH:$HOME/.local/bin
source ~/.bashrc

echo "serve"
cd /home/ec2-user/efs/serve_code
nohup gunicorn -b [HOST]:[PORT] -w 1 'app:app' &
```

# Training Result
<div align="center">
  <img src="./serve_code/model/YOUR_DATASET_NAME_result/YOUR_DATASET_NAME/img/A2B_0100000.png">
</div>
