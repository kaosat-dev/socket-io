var io = require('socket.io').listen(8082);
io.set('log level', 1);


var clientsMap = {};

io.sockets.on('connection', function (socket) {
  console.log("connected ",socket.id);

  clientsMap[socket.id] = {};
  socket.emit('userChanged',clientsMap); //send users list on connection

  socket.on('message', function (data) {
    console.log("SERVER recieved message",data);
    data.senderId = socket.id;
    console.log("Server sending out", data);
    socket.broadcast.emit('message',data);
  });

  socket.on('userChanged', function (data) {
    console.log("SERVER recieved userChanged",data);
    clientsMap[socket.id].name = data.user.name;
    clientsMap[socket.id].color = data.user.color;
    socket.broadcast.emit('userChanged',clientsMap);
  });
  
  socket.on('disconnect', function() {
    console.log("user",clientsMap[socket.id].name,"disconnected");
  });

});
