const { dialog } = require('electron')
let SerialPort = require('serialport')
let xbee_api = require('xbee-api')

let AsyncLock = require('async-lock')
let lock = new AsyncLock()

let pool = {
  buffers: [],
  totalLength: 0,

  reset() {
    this.buffers = []
    this.totalLength = 0
  }
}

let xbeeAPI = new xbee_api.XBeeAPI({
  raw_frames: true
})

let serialPort = undefined
function registerSerialPort(window, port) {
  if (serialPort !== undefined) {
    serialPort.close()
  }

  serialPort = new SerialPort(port, {
    baudRate: 9600,
    parser: xbeeAPI.rawParser()
  })

  serialPort.on('open', function() {
    console.log('Serial port open')
  })

  serialPort.on('error', err => dialog.showErrorBox('Erreur lors de la communication avec le port série', err.message))

  lock.acquire('data', (done) => {
    serialPort.on('data', function(buffer) {
      let coordinates = [0, 0, 0]

      if (pool.totalLength !== 14) {
        pool.buffers.push(buffer)
        pool.totalLength += buffer.length

        if (pool.totalLength > 14) pool.reset()
        if (pool.totalLength !== 14) return
      }

      let data = Buffer.concat(pool.buffers)

      let coordinateIndex = 0
      for (let i = 1; i <= 12; i += 4) {
        let ent = (data[i] << 8) | data[i+1]
        let dec = (data[i+2] << 8) | data[i+3]
        let negative = false

        if (ent > 32767) {
          ent = 65536 - ent
          negative = true
        }
        let coordinate = ent + (dec / 1000)
        if (negative) coordinate *= -1
        coordinates[coordinateIndex] = coordinate

        coordinateIndex++
      }

      pool.reset()
      window.webContents.send('data__addPoint', coordinates)
      done()
    })
  })
}

module.exports = { registerSerialPort }
