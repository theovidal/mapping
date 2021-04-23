#include <LIDARLite.h>
#include <Servo.h> 
#include <Wire.h>
#include <SoftwareSerial.h>

LIDARLite lidar;
SoftwareSerial xbee(2, 3);
Servo servo_body;
Servo servo_lidar;

int const servo_body_port = 9;
int const servo_lidar_port = 10;

int const lidarMode = 4;

int distance = 0;

int deg_body = 0;
int deg_lidar = 0;
float rad_body = 0;
float rad_lidar = 0;

float x = 0;
float y = 0;
float z = 0;

float degToRad(int n) {
  return n * PI / 180;
}

void getParts(float n, int *en, int *dec) {
  *en = (int)(n);
  *dec = abs((int)((n - (float)(*en)) * 1000));
}

void sendData() {
  int x_en, x_dec;
  getParts(x, &x_en, &x_dec);

  int y_en, y_dec;
  getParts(y, &y_en, &y_dec);

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

void getCoordinates() {
  distance = lidar.distance() + 3;
  rad_lidar = degToRad(deg_lidar);
  rad_body = degToRad(deg_body);
  
  x = distance * cos(rad_lidar) * sin(rad_body);
  y = distance * sin(rad_lidar);
  z = distance * cos(rad_lidar) * cos(rad_body);
  delay(15);
}

void setup() {
  Serial.begin(9600);
  xbee.begin(9600);
  lidar.begin(lidarMode, true);

  servo_body.attach(servo_body_port);
  servo_lidar.attach(servo_lidar_port);
}

void loop() {
  for (deg_body = 0; deg_body <= 180; deg_body++) {
    servo_body.write(deg_body);
    delay(15);
    
    for (deg_lidar = 0; deg_lidar <= 180; deg_lidar++) {
      servo_lidar.write(deg_lidar);
      delay(15);

      getCoordinates();
      sendData();
     
      Serial.println(deg_lidar);
    }
    
    servo_lidar.write(0);
    delay(1000);
  }

  servo_body.write(0);
}
