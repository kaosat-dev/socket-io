var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var port       = process.env.PORT || 8090; 		// set our port
var fs         = require("fs");
var path       = require("path");
app.use(express.static("./"));

var io = require('socket.io').listen(8082);

//we need to create a fake socket-io component folder, to dance around path issues
var fakePath = path.resolve("./components/socket-io");
if(!(fs.existsSync( fakePath ) ) )
{
  fs.mkdirSync( fakePath );
  fs.symlinkSync(path.resolve("./socket-io.html"), path.resolve("./components/socket-io/socket-io.html"))
}

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

app.listen(port);
console.log('Started web server on port ' + port);
