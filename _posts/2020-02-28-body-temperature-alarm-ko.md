---
title: "AWS 클라우드, 라즈베리파이, 온도센서를 활용한 체온 알람 서비스"
date: 2020-02-28 12:26:54 +0900
---

요즘 신종 코로나19(COVID-19) 로 인하여 국내외가 어지럽습니다. 한국에서도 많은 수의 확진자가 발생하고 있으며, 공항, 병원 등을 비롯한 많은 곳에 열감지 카메라들이 설치되고 있습니다. 하지만 많은 곳에서 카메라 옆에 사람이 상주하여 카메라를 계속 모니터링 하고있습니다.

저는 IT 개발자로서 알고있는 지식으로 더 편하고, 빠르고, 정확하게 판단하고 알려주는 서비스를 만들고 싶다는 생각을 하게 되었습니다.

![doorman](/assets/images/2020-02-28/doorman.jpg)

## Thermal camera

더 화소수가 많고 성능이 좋은 카메라는 비싸고, 특히 중국에서 배송이 되야 하므로, 즉시 구할수 있는 8x8 의 해상도를 가진 열화상 카메라를 구매했습니다.

AMG8833 센서를 부착한 [Adafruit AMG8833 IR Thermal Camera Breakout](http://www.devicemart.co.kr/goods/view?no=12382843) 입니다.

![amg8833](/assets/images/2020-02-28/amg8833.jpg)

[python + pygame 으로 만든 샘플 코드 입니다.](https://learn.adafruit.com/adafruit-amg8833-8x8-thermal-camera-sensor/raspberry-pi-thermal-camera)

## Raspberry pi

Initially, [AWS Deeplens](https://aws.amazon.com/ko/deeplens/) was considered, but the thermal cameras received information through GPIO, so we had to find another alternative. So I chose the Raspberry Pi which was in the desk drawer.

Fortunately, the Raspberry Pi case was compatible with Lego, so the Raspberry camera and thermal camera could be installed on the Lego blocks.

![raspberrypi](/assets/images/2020-02-28/raspberrypi.jpg)

I installed a python program on my Raspberry Pi and gave it permission to upload photos to the [Amazon S3](https://aws.amazon.com/ko/s3/).

For more code, please refer to [here](https://github.com/nalbam/rpi-doorman).

## Slack App

In order to receive notifications from Slack, or to save usernames in Slack, Slack App was created according to [Settings](https://github.com/nalbam/deeplens-doorman/blob/master/README-slack.md).

![slack-04](/assets/images/2020-02-28/slack-04.png)

## Lambda Backend

When the photo is uploaded to Amazon S3 Bucket, [Aws Lambda function](https://aws.amazon.com/ko/lambda/) should be called by `Trigger`.
The Lambda function performs facial recognition with [Aws Rekognition](https://aws.amazon.com/ko/rekognition/) and stores them in [Amazon DynamoDB](https://aws.amazon.com/ko/dynamodb/) for each person.

This time, I developed and deployed using [Serverless framework](https://serverless.com/).

For more code, please refer to [here](https://github.com/nalbam/deeplens-doorman-backend).

## Amplify Frontend

Web-based service for names and photos stored in DynamoDB.
This app was developed and distributed using [AWS Amplify](https://aws.amazon.com/ko/amplify/).

Forntend used `Javascript` and` React`.
Then, I used the 'Rest API' to search DynamoDB created in Backend, which I also created with the `AWS Lambda function`.

If the app doesn't know the name, it is saved as `Unknown`, and the form that stores the name is handled using [Amazon Cognito](https://aws.amazon.com/ko/cognito/). Amplify made it easy to apply the login and signup pages without coding them.

![doorman-web](/assets/images/2020-02-28/doorman-web.png)

For more code, please refer to [here](https://github.com/nalbam/doorman).
