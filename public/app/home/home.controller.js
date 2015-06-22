app.controller('HomeController', function($scope, $http) {

  //Initiating socket
  var socket = io();

  //Initiating the paper object to be globally available
  function initiate () { 
    console.log('initiated!');
    paper.install(window);
    paper.setup("myCanvas");
  };
  initiate();

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
    //sending my drawing
    socket.emit('meDrawing', JSON.stringify(path_to_send));
  }

  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  }

  // a foggy night sky
  // var blackSquare = Path.Rectangle(new Point(0,0), new Size(view.size._width,view.size._height));
  // blackSquare.fillColor = 'black';
  // blackSquare.opacity = 0.85;
  // blackSquare = new Layer();

  // creating new tool to "erase" or "clear" the sky
  var tool2 = new Tool();

  var stroke3;
  var path_to_send2 = {};

  tool2.onMouseDown = function (event) {
    stroke3 = new Path();
    stroke3.fillColor = 'green'; //the color does not affect the functionality
    stroke3.opacity = 1;
    stroke3.strokeWidth = 20;
    stroke3.blendMode = 'destination-out'; //conflicts with stroke2.fillColor
    stroke3.add(event.point);
  // defining what to send via sockets
    path_to_send2 = {
      color: stroke3.fillColor,
      start: event.point,
      stroke3: [],
      blendMode: stroke3.blendMode
    }
  }

  tool2.onMouseDrag = function (event) {
    var step = event.delta.divide(2)
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke3.add(top);
    stroke3.insert(0, bottom);
    stroke3.smooth();

    path_to_send2.stroke3.push({
      top: top,
      bottom: bottom
    });

    //sending my clearing
    socket.emit('clearingTheSky', JSON.stringify(path_to_send2));
  }

  tool2.onMouseUp = function (event) {
    stroke3.add(event.point);
    stroke3.closed = true;
    stroke3.smooth();
  }

  var drawingTools = [tool, tool2];


//buttons allow toggling between erasing and decorating the sky
  $scope.erase = function () {
    drawingTools[1].activate();
  }

  $scope.decorate = function () {
    drawingTools[0].activate();
  }


//socket events

  // When friends start drawing
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
  
  //when friends start to clear the sky
  socket.on('friendsClearing', function(data) {
    console.log('friendClearing', JSON.parse(data));
    var stroke4 = new Path();
    var friendsClearing = JSON.parse(data);
    var clearingStroke = friendsClearing.stroke3;
    var start_clear_point = new Point(friendsClearing.start[1], friendsClearing.start[2])
    var blendMode = friendsClearing.blendMode;
    var color = friendsClearing.color
    stroke4.blendMode = blendMode;
    stroke4.fillColor = color;
    stroke4.add(start_clear_point);
    for(var i = 0; i < clearingStroke.length; i++) {
      stroke4.add(new Point(clearingStroke[i].top[1], clearingStroke[i].top[2]));
      stroke4.insert(0, new Point(clearingStroke[i].bottom[1], clearingStroke[i].bottom[2]));
    }
    stroke4.smooth();
    view.draw();
    view.update();  
  });

  //sending the night starry night
  socket.emit('sendtheNight', project);

});
