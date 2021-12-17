---
layout: post
title: "딥레이서 타이머 및 센서 제작기"
feature-img: /assets/images/2019-11-07/track.jpg
# thumbnail: /assets/images/2019-11-07/track.jpg
header:
  og_image: /assets/images/2019-11-07/track.jpg
tags: [deepracer, timer, sensor]
---

저는 지난해 말 AWS re:Invent 2018에 참가했습니다. AWS는 딥레이서를 발표하였고, 워크샵에 참가하여 딥레이서를 받았습니다. 그때부터 딥레이서를 훈련하였고 몇몇 대회에 참가하고 나쁘지 않은 성적도 거두었습니다. 서울 서밋에서 9등, 도쿄 서밋에서 22등... 그리고 온라인 리그 6개시즌 포인트 합산 순위 6등으로 AWS re:Invent 2019에서 열리는 결승전에 참가 할 수 있게 되었습니다.

![learderboard](/assets/images/2019-11-07/learderboard.png)

딥레이서 커뮤니티에서 많은 정보를 얻었는데, 그 중 어떤 사용자가 딥레이서 타이머를 만들면서 레이저 센서로 랩타임을 체크하는 사진을 보게 되었습니다. 하지만 레이저 센서 타워(?)를 트랙에 세우게 되면 딥레이서와 충돌 할수 있겠다는 생각이 들었고, 이것을 해결하고 나도 타이머를 만들고 싶다는 욕구가 생겼습니다.

그러던 중 메가존클라우드로 이직하게 되었고, 메가존클라우드가 후원하는 딥레이서 대회에서 PitBoss 로 대회를 지원하는 역할을 했습니다. 딥레이서 타이머와 리더보드를 만들었고, 압력 감지 센서 ( SEN0299 : https://www.eleparts.co.kr/goods/view?no=7643152 ) 를 라즈베리파이에 GPIO 로 연결해 보았습니다.

![Pressure Sensor (SEN0299)](/assets/images/2019-11-07/pressure-sensor.png)

그리고 테스트...

https://www.youtube.com/watch?v=7Ek1N-6c0bQ


동영상 마지막 내 맥북이.... 😱
하지만 센서와 라즈베리파이를 직접 연결했을때, 영상의 3번째 시도와 같이 뒷바퀴에 걸리거나, 걸리지 않는 경우가 발생 하였습니다.

![timer](/assets/images/2019-11-07/timer.png)

앞 바퀴가 밟았음에도 랩타임이 기록되지 않았다.
압력 감지 센서의 감도를 측정해야 하는데 그러기 위해서는 아날로그-디지털 변환기가 들어가면 좋을것 같아 Sound Sensor ( https://www.eleparts.co.kr/goods/view?no=3001790 ) 에 마이크를 떼어내고 압력 감지 센서를 연결해 보았습니다.

![Sound Sensor](/assets/images/2019-11-07/sound-sensor.jpg)

결과는 성공적 이었고, 이제 실제 대회에 적용해 보기로 했습니다.

하지만 두가지 문제가 더 발생 하였고, 하나는 딥레이서 트랙폭이 60cm 인데, 센서는 40cm 이어서 센서 두개를 연결 해야 했습니다. 또한 센서와 변환기 사이가 너무 멀면 동작 하지 않았고, 그래서 센서와 변환기는 1m 이내로, 변환기와 라즈베리파이 사이를 RJ45 선을 이용하여 연결 하였습니다.

그리고 2019년 10월 30일 AWS Startup DeepRacer League 에서 설치하여 실전 테스트를 하였습니다.

![track](/assets/images/2019-11-07/track.jpg)

출발선에 센서 두개를 양면 테이프로 붙임

https://www.youtube.com/watch?v=E9f_TfVdgaY


RJ45, 즉 랜선 20m 를 사용했음에도 잘 동작 했습니다.

딥레이서 타이며와 센서를 연결하는 방밥은 다음과 같습니다.

![rpi1](/assets/images/2019-11-07/rpi1.jpg)

![rpi2](/assets/images/2019-11-07/rpi2.jpg)

몇년만에 납땜질

변환기는 4개의 핀이 있는데, VCC, GND, AOUT, DOUT 입니다. VCC 는 라즈베리파이의 3V 에 연결해 주었고, GND 는 GND 에 연결 했습니다. AOUT 는 사용하지 않았고, DOUT 은 각각 라즈베리파이의 11번과 13번 핀에 연결해 주었습니다. 그리고 라즈베리파이에 SSH 로 접속해서 딥레이서 타이머 소스를 clone 하고, 시작 쉘을 실행해 줍니다.

```bash
git clone https://github.com/nalbam/deepracer-timer
./deepracer-timer/run.sh init
```

이제 RaspberryPi 의 브라우저에서 http://localhost:3000 에 접속하면 됩니다.

마우스로 화면 상단의 버튼을 클릭하여 제어 할수 있고, 키보드로도 가능 합니다. 키보드의 Q, W, E, R, T 가 각각 Start, Pause, Passed, Reset, Clear 버튼과 매핑 됩니다. 숨겨진 키로 Y 는 마지막 랩타임을 현재 시간에 더해주는 역할을 합니다. 딥레이서 네바퀴 모두가 이탈하여 Out 상태에서 멈추지 않고 센서를 밟았을때를 해결 하기 위함 입니다.

딥레이서 타이머는 센서를 제외하고 여기에서 온라인 테스트를 할 수 있습니다.

메가존클라우드에서 후원하여 제가 핏보스로 지원했던 대회의 리더보드들 입니다.

[AWS Cloud Day - Busan](https://dracer.io/league/busan-1909)
[SOSCON 2019 ROBOT MOBILITY](https://dracer.io/league/soscon-2019)
[AWS Startup DeepRacer League](https://dracer.io/league/startup-2019)

그리고 아래는 딥레이서를 하며 만든 코드들 입니다. 딥레이서 훈련이나 리그에 도전 할때 도움이 되길 바랍니다.

딥레이서 타이머 및 리더보드 : https://github.com/nalbam/deepracer-timer

딥레이서 온라인 리그 포인트 수집기 및 리더보드 : https://github.com/nalbam/deepracer-league

딥레이서 온라인 리그 자동 submit 봇 : https://github.com/nalbam/deepracer-submit
