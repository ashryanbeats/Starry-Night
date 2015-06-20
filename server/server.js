// Start the server
var app = require('./app');
// var chalk = require('chalk');
// var socketio = require('socket.io');
// var io = socketio(app.server);

app.startServer()
app.startApp()
// io.on('connection', function(socket) {
//     socket.on('sendCircle', function(data) {
//       console.log('this is data from sendCircle', data);
//     })
// })

