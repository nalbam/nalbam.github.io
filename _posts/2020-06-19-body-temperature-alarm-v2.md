---
layout: post
title: "AWS 클라우드, 라즈베리파이, 온도센서를 활용한 체온 알람 서비스 v2"
# feature-img: /assets/images/2020-06-19/doorman-v2.jpg
# thumbnail: /assets/images/2020-06-19/doorman-v2.jpg
header:
  og_image: /assets/images/2020-06-19/doorman-v2.jpg
tags: [thermal-camera, raspberry-pi, covid-19]
---

이전 포스팅에서 [AWS 클라우드, 라즈베리파이, 온도센서를 활용한 체온 알람 서비스](https://nalbam.github.io/2020/02/28/body-temperature-alarm-ko.html) 를 소개 했습니다.

위의 체온카메라는 [Adafruit AMG8833 IR Thermal Camera Breakout](https://www.adafruit.com/product/3538) 으로 저렴한 가격이지만 성능은 8x8 픽셀로 그리 좋은편은 아니었습니다.

그래서 더 비싸고, 더 좋은 성능의 [FLIR Lepton 3.5](https://groupgets.com/manufacturers/flir/products/lepton-3-5) 로 업그레이드 하고, 라즈베리파이 4로 업그레이드 했습니다.

![doorman](/assets/images/2020-06-19/doorman-v2.jpg)

## Raspberry Pi

먼저 라즈베리파이는 두개의 앱이 동작 하는데요.

[립톤 카메라](https://github.com/nalbam/LeptonModule) 는 립톤이 제공하는 샘플 코드를 조금 손봐서 작성 했습니다. 열감지 센서가 리턴하는 값을 섭씨 온도로 바꿔주고, 일정 온도 이상이거나, 버튼을 누르면, 열화상을 이미지로 변환하여, [Amazon S3](https://aws.amazon.com/ko/s3/) Bucket 에 업로드 하고, 온도 및 기기의 정보를 json에 저장 하여 업로드 합니다.

[파이 카메라](https://github.com/nalbam/rpi-doorman) 는 열화상 이미지가 생성되면, 일반 사진을 캡쳐하어 업로드 하고 있습니다.

## Lambda Backend

[벡엔드 서비스](https://github.com/nalbam/deeplens-doorman-backend) 에서는 [Amazon S3](https://aws.amazon.com/ko/s3/) Bucket 에 일반사진과 열사진 그리고 카메라 위치 및 온도 정보가 업로드 되면, [AWS Lambda Function](https://aws.amazon.com/ko/lambda/) 가 [Amazon Rekognition](https://aws.amazon.com/ko/rekognition/) 으로 안면인식을 수행하여 사람별로 [Amazon DynamoDB](https://aws.amazon.com/ko/dynamodb/) 에 저장 합니다.

## Amplify Frontend

[AWS Amplify](https://aws.amazon.com/ko/amplify/) 프레임웍으로 작성된 [프론트 웹서비스](https://github.com/nalbam/doorman) 에서는 벡엔드로 부터 최근 접속했던 정보를 받아, 접속자의 최근 위치와 사진을 목록으로 보여줍니다.

![frontend](/assets/images/2020-06-19/frontend.jpg)
