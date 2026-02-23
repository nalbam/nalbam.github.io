---
layout: post
title: "Setting Up VibeMon on ESP32: WiFi Configuration in 3 Steps"
feature-img: /assets/images/2026-02-23/startup.jpg
header:
  og_image: /assets/images/2026-02-23/startup.jpg
tags: [vibemon, esp32, arduino, wifi, setup]
---

![VibeMon Startup Screen](/assets/images/2026-02-23/startup.jpg)

## Getting Your ESP32 Ready to Monitor AI

In my [previous post](/2026/02/05/vibemon-en.html), I covered how VibeMon was built — from a tiny LCD screen idea to a full cloud-connected AI status monitor. Today, let's walk through the actual setup process for the ESP32 hardware.

The goal is simple: power on the device, connect it to your WiFi, and let it start receiving live status updates from VibeMon.

---

## Step 1: Power On — The Device Broadcasts Its Own WiFi

Plug the ESP32 into a USB power source. Within a few seconds, you'll see a **random VibeMon character** appear on the tiny LCD screen.

![VibeMon Startup](/assets/images/2026-02-23/startup.jpg)

> The character shown here is **OpenClaw (claw)** — one of the three supported AI agent characters. Which character appears on first boot is randomized.

Along with the character, the screen shows the credentials for its built-in WiFi access point:

```
SSID:     VibeMon-Setup
Password: vibemon123
```

The ESP32 is now acting as its own WiFi hotspot, waiting for you to connect and configure it.

---

## Step 2: Connect to VibeMon-Setup

On your Mac (or any WiFi-capable device), open the WiFi menu and look for the **VibeMon-Setup** network.

![WiFi Network List](/assets/images/2026-02-23/wifi-setup.png)

Select **VibeMon-Setup**, then enter the password when prompted:

![WiFi Password Entry](/assets/images/2026-02-23/wifi-password.png)

```
Password: vibemon123
```

Once connected, your device is now talking directly to the ESP32 over its local network.

---

## Step 3: Configure WiFi and Token via the Setup Page

After connecting, a browser should open automatically — or navigate to `http://192.168.4.1` manually.

You'll see the **VibeMon Setup** page:

![VibeMon Setup Page](/assets/images/2026-02-23/vibemon-setup.png)

The setup page lets you configure three things:

| Field | Required | Description |
|-------|----------|-------------|
| **WiFi SSID** | ✅ | Search and select your home/office WiFi network |
| **WiFi Password** | ✅ | Password for the selected WiFi |
| **VibeMon Token** | Optional | Your token from [vibemon.io](https://vibemon.io) to receive live status updates |

### Selecting Your WiFi

The page scans nearby networks and lists them as selectable options. Just tap or click your network name — no need to type the SSID manually.

### VibeMon Token (Optional but Recommended)

Without a token, the device connects to WiFi but won't receive any status data. To get a token:

1. Visit [vibemon.io](https://vibemon.io)
2. Sign in and generate a token
3. Paste it into the **VibeMon Token** field

> If you skip the token for now, you can always re-enter setup mode by holding the reset button on the ESP32.

---

## What Happens After You Submit

Once you fill in the fields and hit **Save**, the ESP32:

1. **Restarts** automatically
2. **Connects to your WiFi** network using the credentials you provided
3. **Establishes a WebSocket connection** to VibeMon's cloud server
4. **Starts receiving status updates** — and displaying them on screen in real time

The LCD will show your AI agent's current state: thinking, working, idle, or done — all reflected as pixel art animations on the little screen.

---

## Troubleshooting

**Can't find VibeMon-Setup in the WiFi list?**
- Make sure the ESP32 is powered on and the screen shows the setup credentials
- Try moving closer to the device

**Setup page doesn't open automatically?**
- Manually navigate to `http://192.168.4.1` in your browser

**Device isn't connecting to VibeMon after setup?**
- Double-check that your WiFi password was entered correctly
- Confirm your VibeMon Token is valid at [vibemon.io](https://vibemon.io)
- Re-enter setup mode and reconfigure

---

## That's It!

Three steps: power on, connect, configure. Once your ESP32 is on your local network and linked to VibeMon, it quietly sits on your desk and tells you exactly what your AI coding assistant is up to — without you having to glance at the terminal.

---

**Links:**
- Dashboard: [vibemon.io](https://vibemon.io)
- Desktop App: [npm - vibemon](https://www.npmjs.com/package/vibemon)
- GitHub: [nalbam/vibemon](https://github.com/nalbam/vibemon), [nalbam/vibemon-app](https://github.com/nalbam/vibemon-app)
- Hardware: [ESP32-C6-LCD-1.47](https://aliexpress.com/item/1005008465501661.html)
