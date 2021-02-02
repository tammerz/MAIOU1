
# Installing NodeJS on the pi zero w 
https://www.youtube.com/watch?v=qeHpXVUwI08

## I used v10.16.3-linux-armv6l
https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-armv6l.tar.gz


# HX711 library fro NodeJS
https://www.npmjs.com/package/@ataberkylmz/hx711

## 2-Point Calibration explained
https://github.com/bogde/HX711/issues/70#issuecomment-634475201



# Tamara Hotspot data

SSID: TestHotspot
PW: zdxx5443

copy wpa_supplicant.conf into "/etc/wpa_supplicant/wpa_supplicant.conf"  (replace the old one)
then reboot the RPI.

If you need to add a network, edit wpa_supplicant.conf & add this block:

network={
	ssid="newWlan"
	psk="password123"
	id_str="newWlan"
	priority=4
}

Make sure to replace the values. 
"priority": when multiple networks are available simultaneously, the one with the highest priority value is selected.


# pushing server code to heroku
git remote add origin https://git.heroku.com/nameless-sierra-78741.git
git add .
git commit -am "ksdjlhfl"
git push heroku master



# making the RPI code start on reboot
sudo crontab -e

@reboot sudo /usr/local/bin/node /home/pi/Desktop/t1/index.js &

