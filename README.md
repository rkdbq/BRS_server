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
        ├── static
        │   ├── inputs
        │   └── outputs
        └── templates
```

# Data
- Dataset (in Google Drive)
- Weight file (in Google Drive)

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
