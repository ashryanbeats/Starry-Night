app.controller('HomeController', function($scope, $http, $firebaseObject) {

  function initiate () { 
    console.log('initiated!');
    paper.install(window);
    paper.setup("myCanvas");
  };

  initiate();

  var myPath;
  var drag = false;
  var tool = new Tool();
  var drawingRef = new Firebase("https://whereyourdrawinggetslost.firebaseio.com");
  var drawing = $firebaseObject(drawingRef);
  // drawing.foo = "bar";
  $scope.drawTogether = drawing;
  //load drawings

  // drawing.$save().then(function (drawingRef) {
  //   console.log('hello');
  // });

  // drawing.$bindTo($scope, "drawTogether");

  $scope.msgFromScope = "Try drawing something here!";
  
  tool.onMouseDown = function onMouseDown (event) {
    drag = true;
    myPath = new Path();
    myPath.strokeColor = 'white';
    myPath.add(event.point);
    // project.view.zoom = 1;
  };

  tool.onMouseDrag = function onMouseDrag (event) {
    drag = true;
    myPath.add(event.point);
  };

  tool.onMouseUp = function onMouseUp () {
    drag = false;
    myPath.simplify();
    drawing.myPath = myPath.exportJSON();

    drawing.$save()
      .then(function (drawingRef) {
        console.log('hello');
        console.log('this is drawing importJSON', myPath.importJSON(drawing.myPath));
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  $scope.drawTogether.$loaded()
    .then(function() {
      console.log("loaded record:", $scope.drawTogether);
    })
    .catch(function(err) {
      console.error(err);
    });


  //need to not make the user draw when zooming in
  //need to reconfigure size and center
  // var canvasSize = project.view.size;
  // var center = project.view.center;

  //every time button is clicked zoom in more;
  // $scope.zoom = project.view.zoom = function onMouseDown() {
  //   project.view.zoom = 1;
  // };

});