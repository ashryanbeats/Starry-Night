app.controller('HomeController', function($scope, $http) {
  var socket = io();
  function initiate () { 
    console.log('initiated!');
    paper.install(window);
    paper.setup("myCanvas");
  };
  initiate();

  // Drawing on the night sky
  var tool = new Tool();

  var stroke;
  var path_to_send = {};

  tool.onMouseDown = function (event) {
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);

  //defining what to send via sockets
    path_to_send = {
      color: stroke.fillColor,
      start: event.point,
      stroke: []
    };
    // console.log('this is event.point onMouseDown', event.point);
  };

  tool.onMouseDrag = function (event) {
    var step = event.delta.divide(2)
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();

    path_to_send.stroke.push({
      top: top,
      bottom: bottom
    });
    // console.log('this is event.point onMouseDrag', event.point);
    //emitting my drawing
    socket.emit('meDrawing', JSON.stringify(path_to_send));
  }

  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  }

  // When someone else starts drawing
  socket.on('friendsDrawing', function(data) {
      console.log('friendsDrawing', JSON.parse(data));
      var stroke2 = new Path();
      var friendsDrawing = JSON.parse(data);
      var eachStroke = friendsDrawing.stroke;
      var start_point = new Point(friendsDrawing.start[1], friendsDrawing.start[2])
      var color = friendsDrawing.color
      stroke2.fillColor = color;
      stroke2.add(start_point);
      for(var i = 0; i < eachStroke.length; i++) {
        stroke2.add(new Point(eachStroke[i].top[1], eachStroke[i].top[2]));
        stroke2.insert(0, new Point(eachStroke[i].bottom[1], eachStroke[i].bottom[2]));
      }
      stroke2.smooth();
      console.log('here is stroke2', stroke2);
      view.draw();
      view.update();
  });


  //referencing https://github.com/byrichardpowell/draw/blob/master/public/javascripts/canvas.js
  //for drawing a path in real time

  //referencing https://groups.google.com/forum/#!topic/paperjs/cmQFQNTVABg
  //view.update called in socket listener
  //might conflict with the progress_external_path from above


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
      starArr[i].position.x += starArr[i].bounds.width / 200;
      if (starArr[i].bounds.left > view.size.width) {
        starArr[i].position.x = -starArr[i].bounds.width;
      }
    }
  }


  // var blackSquare = Path.Rectangle(new Point(0,0), new Size(view.size._width,view.size._height));
  // blackSquare.fillColor = 'yellow';
  // blackSquare.opacity = 0.85;
  // blackSquare = new Layer();

  // //creating new tool to clear the night sky or "erase" the blackCover on a path
  // var tool2 = new Tool();

  // var stroke2;
  // var path_to_send2 = {};

  // // project.layers[1].insertChild(0, stroke2);
  // tool2.onMouseDown = function (event) {
  //   stroke2 = new Path();
  //   stroke2.fillColor = 'green'; //the color does not affect the functionality
  //   stroke2.opacity = 1;
  //   stroke2.strokeWidth = 20;
  //   // stroke2.blendMode = 'destination-out'; //conflicts with stroke2.fillColor
  //   stroke2.add(event.point);
  // // //defining what to send via sockets
  //   path_to_send2 = {
  //     color: stroke2.fillColor,
  //     start: event.point,
  //     stroke2: []
  //   }
  // }

  // tool2.onMouseDrag = function (event) {
  //   var step = event.delta.divide(2)
  //   step.angle += 90;

  //   var top = event.middlePoint.add(step);
  //   var bottom = event.middlePoint.subtract(step);

  //   stroke2.add(top);
  //   stroke2.insert(0, bottom);
  //   stroke2.smooth();

  //   path_to_send2.stroke2.push({
  //     top: top,
  //     bottom: bottom
  //   });

  //   //emitting my drawing
  //   socket.emit('clearingTheSky', JSON.stringify(path_to_send2));
  // }

  // tool2.onMouseUp = function (event) {
  //   stroke2.add(event.point);
  //   stroke2.closed = true;
  //   stroke2.smooth();
  // }
  
  // socket.on('friendsSendingtheNight', function(data) {
  //     console.log('friendsSendingtheNight', JSON.parse(data));
  // });

  //project refers the work done on the canvas
  socket.emit('sendtheNight', project);
  // socket.on('friendSending', function(data) {
  //   console.log('friendSending', JSON.parse(data));
  // })
  // exporting functions to use in server/app/index.js
  // module.exports = progress_external_path;
});
