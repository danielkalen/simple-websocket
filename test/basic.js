var Socket = require('../')
var test = require('tape')

var SOCKET_SERVER = 'wss://echo.websocket.org'

test('detect WebSocket support', function (t) {
  t.equal(Socket.WEBSOCKET_SUPPORT, true, 'websocket support')
  t.end()
})

test('create socket without options', function (t) {
  t.plan(1)

  var socket
  t.doesNotThrow(function () {
    socket = new Socket('invalid://invalid-url')
  })
  socket.on('error', function (err) {
    t.ok(err instanceof Error, 'got error')
  })
  socket.destroy()
})

test('echo string', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.equal(data.toString(), 'sup!')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo string (opts.url version)', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: SOCKET_SERVER
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.equal(data.toString(), 'sup!')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo Buffer', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(Buffer.from([1, 2, 3]))
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo Uint8Array', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]))
    socket.on('data', function (data) {
      // binary types always get converted to Buffer
      // See: https://github.com/feross/simple-peer/issues/138#issuecomment-278240571
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo ArrayBuffer', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})
