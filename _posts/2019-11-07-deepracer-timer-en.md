---
layout: post
title: "DeepRacer Timer and Sensor Production Log"
feature-img: /assets/images/2019-11-07/track.jpg
# thumbnail: /assets/images/2019-11-07/track.jpg
header:
  og_image: /assets/images/2019-11-07/track.jpg
tags: [deepracer, timer, sensor]
---

I participated AWS re:Invent 2018 last year. AWS presented Deepracer, I participated in the workshop and received a DeepRacer. From then on, I trained the DeepRacer, participated in some leagues, and achieved good grades. I won the 9th place at the Seoul Summit and 22nd place at the Tokyo Summit... And I will be able to take part in the finals at AWS re:Invent 2019 since I won the 6th place in the total points of 6 online league seasons.

![learderboard](/assets/images/2019-11-07/learderboard.png)

I gained plenty of information from the DeepRacer community, among which was a picture of a user making a DeepRacer timer and checking the lap time with a laser sensor. However, if the laser sensor tower (?) is put on the track, I thought it could crash with the DeepRacer. So, a desire to solve this problem and make a timer myself arose.

Meanwhile, I moved my job to MegazoneCloud, and I supported the league as a PitBoss at the DeepRacer league sponsored by MegazoneCloud. I made a DeepRacer timer and a leaderboard, and connected the pressure sensor to Raspberry Pi with GPIO.

![Pressure Sensor (SEN0299)](/assets/images/2019-11-07/pressure-sensor.png)

And test...

https://www.youtube.com/watch?v=7Ek1N-6c0bQ


However, when I directly connected the sensor with Raspberry Pi, there were times when it was caught in the rear wheel or when it wasn't, as it is shown in the third attempt of the video.

![timer](/assets/images/2019-11-07/timer.png)

I had to measure the sensitivity of the pressure sensor, but in order to do that, I thought it would be good to have an analog-to-digital converter in it, so I took the microphone off the Sound Sensor and connected the pressure sensor to it.

![Sound Sensor](/assets/images/2019-11-07/sound-sensor.jpg)

The result was successful then I've decided to apply it to the actual competition.

However, there were two more problems that occurred. The first problem is that the width of the DeepRacer track was 60 cm, but the width of the sensor was only 40 cm, so I had to connect two sensors. Also, since it did not operate when the distance between the sensor and the converter was too far, I set the distance between the sensor and the converter at less than 1 meter, and connected the converter and Raspberry Pi using RJ45 connector. Also I installed and tested in AWS Startup DeepRacer League.

![track](/assets/images/2019-11-07/track.jpg)

https://www.youtube.com/watch?v=E9f_TfVdgaY


Eventhough I used RJ45, LAN 20m, it worked very well.

This is the way how to connect the DeepRacer timer to the sensor.

![rpi1](/assets/images/2019-11-07/rpi1.jpg)

![rpi2](/assets/images/2019-11-07/rpi2.jpg)

The converter has 4 pins, VCC, GND, AOUT, and DOUT. VCC was connected to Raspberry Pi's 3V, and GND to GND. AOUT was not used, and DOUT was connected to pins 11 and 13 of Raspberry Pi, respectively. Then, I accessed to Raspberry Pi with SSH, cloned the DeepRacer timer source, and ran the start shell.

```bash
git clone https://github.com/nalbam/deepracer-timer
./deepracer-timer/run.sh init
```

You can now access http://localhost:3000 in your RaspberryPi's browser.

It can be controlled by clicking the button at the top of the screen with the mouse or keyboard. The keys, Q, W, E, R, and T on the keyboard are mapped to the Start, Pause, Passed, Reset and Clear buttons. The hidden key, Y, adds the last lap time to the current time. It is to resolve the problem when all four wheels of the DeepRacer get detached and the sensor is operated without stopping.

You can do the DeepRacer Timer on-line test it here except Sensor.

Listed below are the leaderboards of the league, sponsored by MegazoneCloud and supported by me as a PitBoss.

[AWS Cloud Day - Busan](https://dracer.io/league/busan-1909)
[SOSCON 2019 ROBOT MOBILITY](https://dracer.io/league/soscon-2019)
[AWS Startup DeepRacer League](https://dracer.io/league/startup-2019)

Also, listed below are some of the codes that I have created while doing the DeepRacer. I hope these will help you when you try participating in the DeepRacer training or DeepRacer leagues.

DeepRacer timer and leaderboard: https://github.com/nalbam/deepracer-timer

DeepRacer online league point collector and leaderboard: https://github.com/nalbam/deepracer-league

DeepRacer online league auto submit bot: https://github.com/nalbam/deepracer-submit
