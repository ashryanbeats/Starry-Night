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

  var moon = new Path.Circle({
    position: view.center,
    radius: 30,
    fillColor: 'yellow',
  });

  moon.removeSegment(2);
  moon.smooth();
  moon.rotate(-30);


  var center = new Point(50, 50);
  var points = 5;
  var radius1 = 5;
  var radius2 = 10;
  var star = new Path.Star(center, points, radius1, radius2);
  
  // star.fillColor = 'yellow';
  star.style = {
    fillColor: 'yellow',
    opacity: 0.7
  }

  var starArr = [];
  for (var i = 0; i < 150; i++) {
    var starCopy = star.clone();
    var randomPosition = Point.random();
    randomPosition.x = randomPosition.x * view.size._width;
    randomPosition.y = randomPosition.y * view.size._height;
    starCopy.position = randomPosition;
    starCopy.rotate(Math.random() * 360);
    starCopy.scale(0.25 + Math.random() * 0.75);
    starArr.push(starCopy);
  }

  star.remove();

  view.onFrame = function (event) {
    for(var i = 0; i < starArr.length; i++) {
      starArr[i].fillColor.hue +=  (1 - Math.round(Math.random()) * 2) * (Math.random() * 4);
      starArr[i].rotate(Math.random());
    }
  }

  socket.emit('sendtheNight', project);

  socket.on('gotIt', function(data) {
    console.log('yay', data);
  })

});