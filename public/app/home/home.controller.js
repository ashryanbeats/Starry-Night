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

  // var myCircle = new Path.Circle(new Point(100, 70), 50);

  var myCircle = new Path.Circle({
    center: view.center,
    radius: 30,
    fillColor: 'red'
  });

  var destination = Point.random() * view.size;

  view.onFrame = function (event) {
    // Each frame, change the fill color of the path slightly by
    // adding 1 to its hue:
    myCircle.fillColor.hue += 1;

    // var vector = destination - myCircle.position;

    // myCircle.position += vector / 30;

    // myCircle.content = Math.round(vector.length);

    // if(vector.length < 5) {

    //   destination = Point.random() * view.size;
    // }

    socket.emit('sendCircle', myCircle);
  }

  socket.on('gotIt', function(data) {
    console.log('jfkdlasjfdsklfjaslfjdkjf DATTATA', data);
  })

  // tool.onMouseDown = function onMouseDown (event) {
  //   drag = true;
  // };
  
  // tool.onMouseDrag = function onMouseDrag (event) {  

  // };

  // tool.onMouseUp = function onMouseUp () {
  //   drag = false;
  // };

});