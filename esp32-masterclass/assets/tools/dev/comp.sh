#!/bin/bash
# Usage: comp.sh NAME  -> compiles $W/sk/NAME.cpp with esp32 core 3.3.12, prints OK/FAIL (log in $W/skb/NAME/log.txt)
W=${ESP32MC_WORK:-/tmp/esp32mc}; id=$1; d=$W/skb/$id; mkdir -p $d; cp $W/sk/$id.cpp $d/$id.ino
grep -q 'secrets.h' $d/$id.ino && printf '#pragma once\n#define WIFI_SSID "x"\n#define WIFI_PASS "y"\nconst char* ssid="x"; const char* password="y";\n' > $d/secrets.h
fqbn=esp32:esp32:esp32; grep -q esp_camera $d/$id.ino && fqbn=esp32:esp32:esp32cam
# Wi-Fi + BLE together do not fit the default 1.3 MB app partition; the lessons tell students to pick Huge APP
grep -q "BLEDevice.h" $d/$id.ino && grep -qE "WiFi.h|WebServer.h" $d/$id.ino && fqbn=esp32:esp32:esp32:PartitionScheme=huge_app
CT=""; [ -x $W/ctags/ctags ] && CT="--build-property runtime.tools.ctags.path=$W/ctags"
if $W/acli/arduino-cli compile -b $fqbn $CT $d > $d/log.txt 2>&1; then echo "OK $id"; else echo "FAIL $id"; fi
