var io = require('socket.io').listen(8082);
io.set('log level', 1);


clients = []

io.sockets.on('connection', function (socket) {

  clients.push(socket.id);
  console.log("Client " + socket.id +" connected");
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('message', function (data) {
    console.log("SERVER recieved message",data);
  });
  socket.on('foo', function (data) {
    console.log("SERVER recieved foo",data);
  });

  var index = 0;
  function spamMessage()
  {
    socket.emit('news', { hello: 'world'+index });
    index +=1;
  }

  setInterval( spamMessage, 700);
});
