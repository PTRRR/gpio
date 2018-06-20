const WebSocketServer = require('websocket').server
const http = require('http')

const server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
})
server.listen(1337, function() { })

// create the server
wsServer = new WebSocketServer({
  httpServer: server
})

// WebSocket server
wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin)
  console.log('new connection')
  send('connected')

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
      console.log(message)
    }
  })

  connection.on('close', function(connection) {
    // close user connection
  })

  function send(type, message) {
    connection.send(JSON.stringify({
      type,
      message
    }))
  }
})