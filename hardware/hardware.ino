#include <SoftwareSerial.h>
SoftwareSerial XBee(2, 3);

float count = -15;
float x = 0;
float y = 0;
float z = 0;

void getParts(float n, int *en, int *dec) {
  *en = (int)(n);
  *dec = abs((int)((n - (float)(*en)) * 1000));
}

void setup() {
  XBee.begin(9600);
  Serial.begin(9600);
}

void loop() {
  count += 0.1;
  
  x = count;
  int x_en, x_dec;
  getParts(x, &x_en, &x_dec);

  Serial.println(x_en);
  Serial.println(x_dec);

  y = count;
  int y_en, y_dec;
  getParts(y, &y_en, &y_dec);

  z = count;
  int z_en, z_dec;
  getParts(z, &z_en, &z_dec);

  int data[6] = {
    x_en, x_dec,
    y_en, y_dec,
    z_en, z_dec
  };

  XBee.write(1);
  for (int i = 0; i < 6; i++) {
     int n = data[i];
     XBee.write((n >> 8) & 0xFF);
     XBee.write(n & 0xFF);
  }
  XBee.write((byte)(0));
  delay(20);
}
