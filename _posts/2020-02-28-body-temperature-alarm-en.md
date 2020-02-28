---
title: "Temperature alarm service using AWS Cloud, Raspberry Pi and Thermal camera"
date: 2020-02-28 14:26:54 +0900
---

These days, the new corona 19 (COVID-19) is disturbing at home and abroad. There are a large number of confirmed patients in Korea, and thermal cameras are installed in many places, including airports and hospitals. But in many places camera people keep monitoring the camera.

As an IT developer, I have come to think that I want to create a service that makes notifications easier, faster and more accurate.

![doorman](/assets/images/2020-02-28/doorman.jpg)

## Thermal camera

Higher pixel count and better cameras are expensive, especially since they need to be shipped from China, so I bought a thermal camera with an 8x8 resolution available immediately.

[Adafruit AMG8833 IR Thermal Camera Breakout](http://www.devicemart.co.kr/goods/view?no=12382843)

![amg8833](/assets/images/2020-02-28/amg8833.jpg)

[Sample code made with python + pygame.](https://learn.adafruit.com/adafruit-amg8833-8x8-thermal-camera-sensor/raspberry-pi-thermal-camera)

## Raspberry pi

처음에는 [AWS Deeplens](https://aws.amazon.com/ko/deeplens/) 가 고려되었으나, 열감지 카메라가 GPIO 틑 통해 정보를 받으므로 다른 대안을 찾아야 했습니다. 그래서 책상 서랍에 있던 라즈베리파이를 선택 했습니다.

다행이도 라즈베리파이 케이스가 레고호환이어서 라즈베리 카메라와 열감지 카메라를 레고 거치대에 설치할 수 있었습니다.

![raspberrypi](/assets/images/2020-02-28/raspberrypi.jpg)

라즈베리파이에 python 으로 된 프로그램을 설치하고, [Amazon S3](https://aws.amazon.com/ko/s3/) Bucket 에 사진을 업로드 할수 있는 권한도 부여 했습니다.

자세한 코드는 [여기](https://github.com/nalbam/rpi-doorman)를 참고 하세요.

## Slack App

슬랙에 알림을 받거나, 슬랙에서 사용자 이름을 지정 하기 위하여 [설정법](https://github.com/nalbam/deeplens-doorman/blob/master/README-slack.md) 에 따라 Slack App 을 만들어 줬습니다.

![slack-04](/assets/images/2020-02-28/slack-04.png)

## Lambda Backend

Amazon S3 Bucket 에 사진이 업로드 되면 `Trigger` 에 의하여 [Aws Lambda function](https://aws.amazon.com/ko/lambda/) 이 호출되야 합니다.
그리고 Lambda function 에서는 [Aws Rekognition](https://aws.amazon.com/ko/rekognition/) 으로 안면인식을 수행하여 사람별로 [Amazon DynamoDB](https://aws.amazon.com/ko/dynamodb/) 에 저장 합니다.

이번에는 [Serverless framework](https://serverless.com/) 을 이용하여 개발 및 배포를 했습니다.

자세한 코드는 [여기](https://github.com/nalbam/deeplens-doorman-backend)를 참고 하세요.

## Amplify Frontend

DynamoDB 에 저장된 이름과 사진을 웹을 통해 서비스 합니다.
이 앱은 [AWS Amplify](https://aws.amazon.com/ko/amplify/) 를 이용하여 개발 및 배포를 했습니다.

Forntend 는 `Javascript` 와 `React` 를 사용 했습니다. 그리고 `Rest API` 를 사용하여 Backend 에서 만든 DynamoDB 를 조회 하였고, 이 역시 `AWS Lambda function` 으로 생성 하였습니다.

인식은 하였으나 이름을 모르는 사람은 `Unknown` 으로 저장 하였고, 이름을 저장 하는 폼을 위해 [Amazon Cognito](https://aws.amazon.com/ko/cognito/) 를 사용해서 인증을 처리 했습니다. Amplify 를 통해 손 쉽게 로그인 및 가입 페이지를 직접 코딩하지 않고도 적용할 수 있었습니다.

![doorman-web](/assets/images/2020-02-28/doorman-web.png)

자세한 코드는 [여기](https://github.com/nalbam/doorman)를 참고 하세요.
