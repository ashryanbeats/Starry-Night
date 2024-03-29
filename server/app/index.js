var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path');
var logger = require('morgan');
var chalk = require('chalk');
var bodyParser = require('body-parser');

var publicPath = path.join(__dirname, '../../public');
var indexHtmlPath = path.join(__dirname, '../index.html');
var nodePath = path.join(__dirname, '../../node_modules');

var startApp = function() {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(publicPath));
  app.use(express.static(nodePath));

  app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
      res.status(404).end();
    } else {
      next(null);
    }

  });

  app.use('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, './views/index.html'));
  });

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.sendStatus(err.status || 500);
  });
};

io.on('connection', function(socket) {
    console.log('connected', socket.id);

    socket.on('sendtheNight', function(data) {
        socket.broadcast.emit('friendsSending', data);
    });

    socket.on('meDrawing', function(data) {
        socket.broadcast.emit('friendsDrawing', data);
    });

    socket.on('clearingTheSky', function(data) {
        socket.broadcast.emit('friendsClearing', data);
    });
});

var startServer = function() {
  var port = 4545;
  server.listen(port, function() {
    console.log('The server is listening on port', chalk.green.bold(port), 'and loves you very much.');
  });
  
};

module.exports = {
  startApp: startApp,
  startServer: startServer,
  server: server
};