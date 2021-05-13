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

int x_stack[181] = {};
int y_stack[181] = {};
int z_stack[181] = {};

float degToRad(int n) {
  return n * PI / 180;
}

void getParts(float n, int *en, int *dec) {
  *en = (int)(n);
  *dec = abs((int)((n - (float)(*en)) * 1000));
}

void sendData() {
  for (int deg = 0; deg <= 180; deg++) {
    int x_en, x_dec;
    getParts(x_stack[deg], &x_en, &x_dec);
  
    int y_en, y_dec;
    getParts(y_stack[deg], &y_en, &y_dec);
  
    int z_en, z_dec;
    getParts(z_stack[deg], &z_en, &z_dec);
  
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
}

void getCoordinates() {
  distance = lidar.distance() - 1;
  rad_lidar = degToRad(deg_lidar);
  rad_body = degToRad(deg_body);
  
  x_stack[deg_lidar] = distance * cos(rad_lidar) * sin(rad_body);
  y_stack[deg_lidar] = distance * sin(rad_lidar);
  z_stack[deg_lidar] = distance * cos(rad_lidar) * cos(rad_body);
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
    }
    
    servo_lidar.write(0);
    sendData();
  }

  servo_body.write(0);
}
