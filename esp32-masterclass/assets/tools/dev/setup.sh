#!/bin/bash
# One-time setup of the verification toolchain in a fresh container (about 5-10 minutes).
# Everything goes to $ESP32MC_WORK (default /tmp/esp32mc); nothing is written into the repo.
set -e
W=${ESP32MC_WORK:-/tmp/esp32mc}; mkdir -p $W && cd $W
# 1) Playwright for shot.js / el.js / pdf.js (Chromium is preinstalled at /opt/pw-browsers/chromium)
[ -d node_modules/playwright ] || npm i --silent playwright
# 2) arduino-cli + ESP32 core 3.3.12
if [ ! -x acli/arduino-cli ]; then
  mkdir -p acli && curl -fsSL https://github.com/arduino/arduino-cli/releases/download/v1.2.2/arduino-cli_1.2.2_Linux_64bit.tar.gz | tar xz -C acli
fi
A=$W/acli/arduino-cli
$A config init --overwrite >/dev/null
$A config add board_manager.additional_urls https://espressif.github.io/arduino-esp32/package_esp32_index.json
$A core update-index && $A core install esp32:esp32@3.3.12
# 3) Libraries used by the lessons (git clone works even when the Arduino library index is blocked)
L=$HOME/Arduino/libraries; mkdir -p $L
for r in adafruit/Adafruit-GFX-Library adafruit/Adafruit_SSD1306 adafruit/Adafruit_BusIO adafruit/Adafruit_Sensor \
         adafruit/DHT-sensor-library adafruit/Adafruit_BME280_Library adafruit/Adafruit_NeoPixel \
         madhephaestus/ESP32Servo knolleary/pubsubclient bblanchon/ArduinoJson waspinator/AccelStepper \
         arduino-libraries/Stepper mikalhart/TinyGPSPlus tzapu/WiFiManager; do
  n=${r#*/}; [ -d $L/$n ] || git clone -q --depth 1 https://github.com/$r $L/$n
done
# 4) Wokwi pin names for wokcheck.py
[ -d wboards ] || git clone -q --depth 1 https://github.com/wokwi/wokwi-boards.git wboards
[ -d welem ]   || git clone -q --depth 1 https://github.com/wokwi/wokwi-elements.git welem
echo "Setup done in $W. Next: start the local server (see PROJECT_GUIDE.md)."
