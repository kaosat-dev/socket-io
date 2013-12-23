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
    data.sender = "other";
    socket.broadcast.emit('message',data);
  });

  socket.on('foo', function (data) {
    console.log("SERVER recieved foo",data);
  });

  var index = 0;
  function spamMessage()
  {
    var data = { hello: 'world'+index };
    console.log("SERVER sending to : news, data",data);
    socket.emit('news', data);
    index +=1;
  }

  setInterval( spamMessage, 700);
});
