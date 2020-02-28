---
title: "라즈베리파이, 온도센서, 아마존웹서비스를 활용한 체온 알람 서비스"
date: 2020-02-28 12:26:54 +0900
---

요즘 신종 코로나19(COVID-19) 로 인하여 국내외가 어지럽습니다. 한국에서도 많은 수의 확진자가 발생하고 있으며, 공항, 병원 등을 비롯한 많은 곳에 열감지 카메라들이 설치되고 있습니다. 하지만 많은 곳에서 카메라 옆에 사람이 상주하여 카메라를 계속 모니터링 하고있습니다.

저는 IT 개발자로서 알고있는 지식으로 더 편하고, 빠르고, 정확하게 판단하고 알려주는 서비스를 만들고 싶다는 생각을 하게 되었습니다.

![doorman](/assets/images/2020-02-28/doorman.jpg)

## Thermal camera

더 화소수가 많고 성능이 좋은 카메라는 비싸고, 특히 중국에서 배송이 되야 하므로, 즉시 구할수 있는 8x8 의 해상도를 가진 열화상 카메라를 구매했습니다.

AMG8833 센서를 부착한 [Adafruit AMG8833 IR Thermal Camera Breakout](http://www.devicemart.co.kr/goods/view?no=12382843) 입니다.

![amg8833](/assets/images/2020-02-28/amg8833.jpg)

[Python + pygame 로 만든 샘플 코드 입니다.](https://learn.adafruit.com/adafruit-amg8833-8x8-thermal-camera-sensor/raspberry-pi-thermal-camera)

## Raspberry pi

처음에는 AWS Deeplens 가 고려되었으나, 열감지 카메라가 GPIO 틑 통해 정보를 받으므로 다른 대안을 찾아야 했습니다. 그래서 책상 서랍에 있던 라즈베리파이를 선택 했습니다.

다행이도 라즈베리파이 케이스가 레고호환이어서 라즈베리 카메라와 열감지 카메라를 레고 거치애에 설치할 수 있었습니다.

라즈베리 카메라에

## Slack

[Slack App](https://github.com/nalbam/deeplens-doorman/blob/master/README-slack.md) 설정 방법에 따라 슬랙 앱을 생성 합니다.

## Lambda Backend

AWS S3 Bucket 에 사진이 업로드 되면 Trigger 에의하여 Aws Lamdba function 이 호출되야 합니다.
그리고 lambda function 에서는 Aws Rekognition 으로 안면인식을 수행 합니다.

이번에는 [Serverless framework](https://serverless.com/) 을 이용하여 개발 및 배포를 하도록 하겠습니다.

## Amplify Frontend
