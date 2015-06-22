app.controller('HomeController', function($scope, $http) {
  var socket = io();
  
  function initiate () { 
    console.log('initiated!');
    paper.install(window);
    paper.setup("myCanvas");
  };

  initiate();

  //Drawing on the night sky
  var tool = new Tool();
  tool.minDistance = 10;
  tool.maxDistance = 45;

  var stroke;
  // var path_to_send = {};

  tool.onMouseDown = function (event) {
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);

  //defining what to send via sockets
    // path_to_send = {
    //   color: stroke.fillColor,
    //   start: event.point,
    //   stroke: []
    // }
  }

  tool.onMouseDrag = function (event) {
    var step = event.delta.divide(2)
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();

    // path_to_send.stroke.push({
    //   top: top,
    //   bottom: bottom
    // });

  //emitting my drawing
    // socket.emit('meDrawing', JSON.stringify(path_to_send));
  }


  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  }


  //referencing https://github.com/byrichardpowell/draw/blob/master/public/javascripts/canvas.js
  //for drawing a path in real time

  // var path = {}
  // var progress_external_path = function(points) {

  //   //if there is currently no path, start the path
  //   if(!path) {
  //     external_paths = new Path();
  //     path = external_paths;

  //   //starting the path
  //     var start_point = new Point(points.start.x, points.start.y);
  //     path.fillColor = {
  //       hue: Math.random() * 360,
  //       saturation: 1,
  //       brightness: 1
  //     };
  //     path.add(start_point);      
  //   }

  //   var paths = points.path;

  //   for(var i = 0; i < paths.length; i++) {
  //     path.add(paths[i].top);
  //     path.insert(0, paths[i].bottom);
  //   }

  //   path.smooth();
  //   view.draw();
  // }

  //referencing https://groups.google.com/forum/#!topic/paperjs/cmQFQNTVABg
  //view.update called in socket listener
  //might conflict with the progress_external_path from above

  // socket.on('friendsDrawing', function(data) {
  //   JSON.parse(data);
  //   view.update();
  // });




  //Putting stars on the night sky
  var center = view.center;
  var points = 5;
  var radius1 = 5;
  var radius2 = 10;
  var star = new Path.Star(center, points, radius1, radius2);
  
  star.style = {
    fillColor: 'yellow'
  }

  var starArr = [];
  for (var i = 0; i < 100; i++) {
    var starCopy = star.clone();
    var randomPosition = Point.random();
    randomPosition.x = randomPosition.x * view.size._width;
    randomPosition.y = randomPosition.y * view.size._height;
    starCopy.position = randomPosition;
    starCopy.rotate(Math.random() * 20);
    starCopy.scale(0.25 + Math.random() * 0.75);
    starCopy.onMouseMove = function(event) {
      this.opacity = Math.random();
    }
    starArr.push(starCopy);
  }

  star.remove();

  view.onFrame = function (event) {
    for(var i = 0; i < starArr.length; i++) {
      starArr[i].fillColor.hue +=  (1 - Math.round(Math.random()) * 2) * (Math.random() * 5);
      starArr[i].rotate(Math.random());
      starArr[i].position.x += starArr[i].bounds.width / 500;
      if (starArr[i].bounds.left > view.size.width) {
        starArr[i].position.x = -starArr[i].bounds.width;
      }
    }
  }

  //project refers the work done on the canvas  
  console.log('this is the project', project);
  socket.emit('sendtheNight', project);
  // exporting functions to use in server/app/index.js
  // module.exports = progress_external_path;

});