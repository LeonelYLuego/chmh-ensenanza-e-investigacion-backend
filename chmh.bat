@echo off

SET PM2_HOME=C:\Users\gabyf\.pm2

SETX /M PM2_HOME %PM2_HOME%

CD %PM2_HOME%

pm2 start "C:\Users\gabyf\Downloads\chmh-ensenanza-e-investigacion-backend-main\dist\main.js"
