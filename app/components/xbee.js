const { dialog, Notification } = require('electron')
const SerialPort = require('serialport')
const xbee = require('xbee-api')
const AsyncLock = require('async-lock')

const parser = new xbee.XBeeAPI({
  raw_frames: true
})

let serialPort = undefined
let lock = new AsyncLock()
let pool = {
  buffers: [],
  totalLength: 0,

  reset() {
    this.buffers = []
    this.totalLength = 0
  }
}

function registerSerialPort(window, port) {
  if (serialPort !== undefined) {
    serialPort.close()
  }

  serialPort = new SerialPort(port, {
    baudRate: 9600,
    parser: parser.rawParser()
  })

  serialPort.on('open', function() {
    new Notification({
      title: 'Port série ouvert',
      body: `Le module de communication sans fil Xbee est connecté sur le port ${port}`
    }).show()
  })

  serialPort.on('close', function() {
    new Notification({
      title: 'Port série fermé',
      body: `Le module de communication sans fil Xbee est déconnecté du port ${port}`
    }).show()
    serialPort = undefined
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
        let integral = (data[i] << 8) | data[i+1]
        let decimal = (data[i+2] << 8) | data[i+3]

        let negative = false
        if (integral > 32767) {
          integral = 65536 - integral
          negative = true
        }

        let coordinate = integral + (decimal / 1000)
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
