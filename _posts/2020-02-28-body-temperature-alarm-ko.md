---
title: "라즈베리파이, 온도센서, 아마존웹서비스를 활용한 체온 알람 서비스 - Doorman"
date: 2020-02-28 12:26:54 +0900
---

요즘 신종 코로나19(COVID-19) 로 인하여 국내외가 어지럽습니다. 한국에서도 많은 수의 확진자가 발생하고 있으며, 공항, 병원 등을 비롯한 많은 곳에 열감지 카메라들이 설치되고 있습니다. 하지만 많은 곳에서 카메라 옆에 사람이 상주하여 카메라를 계속 모니터링 하고있습니다.

저는 IT 개발자로서 알고있는 지식으로 더 편하고, 빠르고, 정확하게 판단하고 알려주는 서비스를 만들고 싶다는 생각을 하게 되었습니다.

## Thermal camera

더 화소수가 많고 성능이 좋은 카메라는 비싸고, 특히 중국에서 배송이 되야 하므로, 즉시 구할수 있는 8x8 의 해상도를 가진 열화상 카메라를 구매했습니다.

AMG8833 센서를 부착한 [Adafruit AMG8833 IR Thermal Camera Breakout](http://www.devicemart.co.kr/goods/view?no=12382843) 입니다.

[Python + pygame 로 만든 샘플 코드 입니다.](https://learn.adafruit.com/adafruit-amg8833-8x8-thermal-camera-sensor/raspberry-pi-thermal-camera)

## Raspberry pi

처음에는 AWS Deeplens 가 고려되었으나, 열감지 카메라가 GPIO 틑 통해 정보를 주고 받으므로 다른 대안을 찾아야 했습니다. 그래서 라즈베리파이를 선택 했습니다.

다행이도 라즈베리파이 케이스가 레고호환이어서 라즈베리 카메라와 열감지 카메라를 레고 거치애에 설치할 수 있었습니다.

### raspberry pi config

라즈베리파이 설정에서 카메라와 I2C 릃 모두 활성화 해줍니다.

```bash
sudo raspi-config
```

```
Interfacing Options -> Camera
Interfacing Options -> I2C
```

프로그램에서 사용될 모듈을 설치 합니다.

```bash
pip3 install boto3
pip3 install colour
pip3 install pygame
pip3 install opencv-python
pip3 install scipy
pip3 install adafruit-blinka
pip3 install adafruit-circuitpython-amg88xx
```

열화상 카메라서에서 온도 정보를 받고, 카메라에서 동영상을 받아서 조합 하고, 지정된 온도 이상이면 AWS S3 Bucket 에 업로드할 프로그램을 다운 받습니다.

```bash
git clone https://github.com/nalbam/rpi-doorman
```

옵션을 주어서 실행 하도록 합니다.

```bash
python3 ./rpi-doorman/run.py --min-temp 18 --max-temp 26 --bucket-name <DOORMAN-BUCKET-NAME>
```

## Lambda

## Amplify
