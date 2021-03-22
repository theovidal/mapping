let util = require('util')
let SerialPort = require('serialport')
let xbee_api = require('xbee-api')

function registerXbee(win) {
  let C = xbee_api.constants

  let xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
  })

  let serialPort = new SerialPort('COM5', {
    baudRate: 57000,
    parser: xbeeAPI.rawParser()
  })

  serialPort.on('open', function() {
    console.log('Serial port open')
  })

  xbeeAPI.on('frame_object', function(frame) {
    console.log(`Received object ${util.inspect(frame)}`)
    //win.webContents.send('data__addPoint', frame)
  })
}

module.exports = registerXbee
