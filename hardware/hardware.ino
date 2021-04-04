#include <LIDARLite.h>
#include <Servo.h> 
#include <Wire.h>
#include <SoftwareSerial.h>

LIDARLite lidar;
Servo servo;
SoftwareSerial xbee(2, 3);

int const lidarMode = 4;

int distance = 0;
int deg = 0;
float rad = 0;

void getParts(float n, int *en, int *dec) {
  *en = (int)(n);
  *dec = abs((int)((n - (float)(*en)) * 1000));
}

void sendData(float x, float y, float z) {
  int x_en, x_dec;
  getParts(x, &x_en, &x_dec);

  int y_en, y_dec;
  getParts(y, &y_en, &y_dec);

  Serial.println(y_en);
  Serial.println(y_dec);

  int z_en, z_dec;
  getParts(z, &z_en, &z_dec);

  int data[6] = {
    x_en, x_dec,
    y_en, y_dec,
    z_en, z_dec
  };

  xbee.write(1);
  for (int i = 0; i < 6; i++) {
     int n = data[i];
     xbee.write((n >> 8) & 0xFF);
     xbee.write(n & 0xFF);
  }
  xbee.write((byte)(0));
  delay(20);
}

void moveLidar() {
  servo.write(deg);
  delay(15);
  distance = lidar.distance() + 5;
  rad = deg * 3.14 / 180;
  float x = distance * cos(rad);
  float y = distance * sin(rad);
  sendData(x, y, 0);
}

void setup() {
  Serial.begin(9600);
  xbee.begin(9600);
  lidar.begin(lidarMode, true);

  servo.attach(10);
  servo.write(0);
}

void loop() {
  for (deg = 0; deg <= 180; deg += 1) {
    moveLidar();
  }
  for (deg = 180; deg >= 0; deg -= 1) {
    moveLidar();
  }
  /*for (int i = 0; i < 100; i++) {
    for (int j = 0; j < 20; j++) {
      sendData(i, j, 0);
    }
  }
  for (int i = 0; i < 100; i++) {
    for (int j = 0; j < 20; j++) {
      sendData(0, j, i);
    }
  }*/
}
