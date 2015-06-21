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

  $scope.msgFromScope = "Try drawing something here!";


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
  star.fillColor = 'yellow';
  star.opacity = 0.7;

  var count = 50;

  view.onFrame = function (event) {
    star.fillColor.hue += 1;
    star.rotate(0.1);
  }



  socket.emit('sendtheNight', project);

  socket.on('gotIt', function(data) {
    console.log('yay', data);
  })

});