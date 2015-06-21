app.controller('HomeController', function($scope, $http, $firebaseArray) {
  var socket = io();

  function initiate () { 
    console.log('initiated!');
    paper.install(window);
    paper.setup("myCanvas");
  };

  initiate();

  var tool = new Tool();
  // var drawingRef = new Firebase("https://whereyourdrawinggetslost.firebaseio.com");
  // var drawing = $firebaseArray(drawingRef);

  tool.minDistance = 10;
  tool.maxDistance = 45;

  var stroke;

  tool.onMouseDown = function (event) {
    console.log('entering mouseDown')
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);
  }

  tool.onMouseDrag = function (event) {
    console.log('entering mouseDrag')
    var step = event.delta.divide(2)
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    console.log('this is top', top);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();
  }


  tool.onMouseUp = function (event) {
    console.log('entering mouseUp')
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  }


  var moon = new Path.Circle({
    center: new Point(50, 50),
    radius: 30,
    fillColor: 'yellow',
  });

  moon.removeSegment(2);
  moon.smooth();
  moon.rotate(-40);

  // var center = new Point(50, 50);
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

  var destination = Point.random();
  console.log('this is destination', destination);

  view.onFrame = function (event) {
    for(var i = 0; i < starArr.length; i++) {
      starArr[i].fillColor.hue +=  (1 - Math.round(Math.random()) * 2) * (Math.random() * 5);
      starArr[i].rotate(Math.random());
      
      // var eachStar = starArr[i];
      // var vector = destination - eachStar.position;
      // starArr[i].position += vector / 30;
      // if (vector.length < 5) {
      //   destination = Point.random() * view.size;
      // }
    }
  }

  socket.emit('sendtheNight', project);

  socket.on('gotIt', function(data) {
    console.log('yay', data);
  })

});