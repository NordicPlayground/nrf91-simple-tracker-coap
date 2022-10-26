<p align="center">
  <img style="width:50%;" src="/public/images/512px-Nordic_Semiconductor_Company_Logo.png">
</p>

## Introduction
This repository contains source code for the nRF91 Simple Tracker application which is part of the Nordic Academy [Cellular IoT Fundamentals Course](https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/). The main purpose of the application is to demonstrate how to pull data from the nRF91 device using [CoAP](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/nrf9160/coap_client/README.html)

## Features
* Connect to any device nRF91 Device GPS Data from a COAP server
* Read and display GPS position on a

The relevant code for connecting to the COAP API is available in `routes/coapData.js`. The code for parsing data is also available in `routes/coapData.js`.

## Requirements
Any of the following development hardware: 

![Image of Thingy:91](https://github.com/NordicPlayground/nrf91-simple-tracker-coap/blob/main/public/images/thingy91.png)

![Image of nRF9160 DK](https://github.com/NordicPlayground/nrf91-simple-tracker-coap/blob/main/public/images/nRF59160-DK.webp)

Nordic **Thingy:91** Cellular IoT prototyping kit. [Buy here](https://www.nordicsemi.com/About-us/BuyOnline?search_token=nRF6943&series_token=nRF9160)

Nordic **nRF9160 DK** Cellular IoT prototyping kit. [Buy here](https://www.nordicsemi.com/About-us/BuyOnline?search_token=nrf9160-DK&series_token=nRF9160)

## How to use
In order to use this web application you must first set up your nRF91 to advertise it's GPS data on some publicly accessable CoAP Server. Refer to the [Cellular IOT Fundamentals Dev Academy Course](https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/).

If the GPS data is avalable on some CoAP server, you can:
1. Copy that deveice URI into this app settings page
2. Click connect

The application should now display live CoAP data from your nRF91 device.

## How to run localy

1. Clone the code from this repo

```bash
  $ git clone https://github.com/NordicPlayground/nrf91-simple-tracker-coap.git
```

2. Go to the application folder

```bash
  $ cd nrf91-simple-tracker-coap
```

3. Run npm install

```bash
  $ npm i
```

4. Run Local server

```bash
  $ npm run server
```

**Result**

```bash
  $ [nodemon] 2.0.20
  $ [nodemon] to restart at any time, enter `rs`
  $ [nodemon] watching path(s): *.*
  $ [nodemon] watching extensions: js,mjs,json
  $ [nodemon] starting `node index.js`
  $ Listening on Port: 6600
```

## Limitations
1. The app has only been tested on Chrome browsers in Windows and Android devices.
2. No autentication has been implimented to access the CoAP Server hence the CoAP server needs to be publicly available.

## Third-party licenses
* **Leaflet** - [BSD 2-Clause "Simplified" License](https://github.com/Leaflet/Leaflet/blob/master/LICENSE)
* **jQuery** - [MIT License](https://jquery.org/license/)
* **Bootstrap** - [MIT License](https://getbootstrap.com/docs/4.0/about/license/)
* **Express** - [MIT License](https://github.com/expressjs/express/blob/HEAD/LICENSE)
* **COAP** - [MIT License](https://github.com/mcollina/node-coap/blob/master/LICENSE.md)

## A note on support
This application is one of several applications that has been built by developers at Nordic Semiconductor as a demo of some particular feature or use case. It has not necessarily been thoroughly tested, so there might be unknown issues. It is hence provided as-is, without any warranty. However, in the hope that it still may be useful also for others than the ones we initially wrote it for, we've chosen to distribute it here on GitHub. Please post any questions about this project on [DevZone](https://devzone.nordicsemi.com/).
