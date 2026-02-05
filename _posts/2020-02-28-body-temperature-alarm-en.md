---
layout: post
title: "Body Temperature alarm service using AWS Cloud, Raspberry Pi and Thermal camera"
feature-img: /assets/images/2020-02-28/doorman.jpg
# thumbnail: /assets/images/2020-02-28/doorman.jpg
header:
  og_image: /assets/images/2020-02-28/doorman.jpg
tags: [thermal-camera, raspberry-pi, covid-19]
---

These days, the novel coronavirus (COVID-19) is causing turmoil both domestically and internationally. A large number of confirmed cases have emerged in Korea, and thermal cameras are being installed in many places, including airports and hospitals. However, in many locations, staff must be stationed next to the cameras to monitor them constantly.

As an IT developer, I wanted to create a service that could judge and notify more conveniently, quickly, and accurately using my knowledge.

![doorman](/assets/images/2020-02-28/doorman.jpg)

## Thermal camera

Higher pixel count and better cameras are expensive, especially since they need to be shipped from China, so I bought a thermal camera with an 8x8 resolution available immediately.

[Adafruit AMG8833 IR Thermal Camera Breakout](https://www.adafruit.com/product/3538)

![amg8833](/assets/images/2020-02-28/amg8833.jpg)

[Sample code made with python + pygame.](https://learn.adafruit.com/adafruit-amg8833-8x8-thermal-camera-sensor/raspberry-pi-thermal-camera)

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

When the photo is uploaded to Amazon S3 Bucket, [AWS Lambda Function](https://aws.amazon.com/ko/lambda/) should be called by `Trigger`.
The Lambda function performs facial recognition with [Amazon Rekognition](https://aws.amazon.com/ko/rekognition/) and stores them in [Amazon DynamoDB](https://aws.amazon.com/ko/dynamodb/) for each person.

This time, I developed and deployed using [Serverless framework](https://serverless.com/).

For more code, please refer to [here](https://github.com/nalbam/deeplens-doorman-backend).

## Amplify Frontend

Names and photos stored in DynamoDB are served through the web.
This app was developed and distributed using [AWS Amplify](https://aws.amazon.com/ko/amplify/).

Frontend used `Javascript` and `React`.
Then, I used the `Rest API` to query DynamoDB created in Backend, which was also created with `AWS Lambda Function`.

People who were recognized but whose names were unknown were saved as `Unknown`. Authentication for the name input form was handled using [Amazon Cognito](https://aws.amazon.com/cognito/). Amplify made it easy to apply login and signup pages without coding them directly.

![doorman-web](/assets/images/2020-02-28/doorman-web.jpg)

For more code, please refer to [here](https://github.com/nalbam/doorman).

## Architecture

![doorman-arch](/assets/images/2020-02-28/doorman-arch.jpg)

Thanks for reading.
