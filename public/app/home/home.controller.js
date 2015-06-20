app.controller('HomeController', function($scope, $http, $firebaseArray, DrawingFactory) {

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
  var drawing = $firebaseArray(drawingRef);
  var myNewPath;
  var myArray = [];
  var drawingArray = [];
  var currentDrawingIndex = 0;

  $scope.msgFromScope = "Try drawing something here!";

  drawing.$loaded().then(function(myDrawings) {
    
    tool.onMouseDown = function onMouseDown (event) {
      drag = true;
      myPath = new Path();
      myPath.strokeColor = 'white';
      myPath.add(event.point);
      var newPointArr = [event.point];
      drawing.$add(JSON.stringify(newPointArr)).then(function(drawingRef) {
        var id = drawingRef.key();
        currentDrawingIndex = drawing.$indexFor(id);
        console.log('this is the location in the array', drawing.$indexFor(id))
      })
      // currentDrawingIndex = drawingArray.push([event.point]) - 1;
       // drawingArray[currentDrawingIndex].push(event.point);
    };
  
    tool.onMouseDrag = function onMouseDrag (event) {
      drag = true;
      myPath.add(event.point);

      var currentPointArr = JSON.parse(drawing[currentDrawingIndex]);
      currentPointArr.push(event.point);

      drawing[currentDrawingIndex] = JSON.stringify(currentPointArr);
      drawing.$save(currentDrawingIndex).then(function(ref) {
          var id = ref.key();
          console.log("firebase key", id);
          console.log("index of this key in our array", drawing.$indexFor(id));
      });

      console.log('this is drawingArray', drawingArray)
      // When YOU start drawing
      // drawing.$add(event.point).then(function(drawingRef) {
        
      //   var firebase_id = drawingRef.key();
        
      //   console.log("added record with id" + firebase_id);
      //   console.log('this is the location in the array', drawing.$indexFor(firebase_id));
      //   myArray.push(firebase_id);
      // });
    };
    console.log('this is myDrawings', myDrawings)
    // // drawing what is already in firebase
    // myDrawings.forEach(function(eachDrawing) {
    //   myPath = new Path();
    //   myPath.importJSON(eachDrawing.$value);

    //   // keep in track of the initial set of drawings
    //   myArray.push(eachDrawing.$key);
    // });

    // console.log('this is myDrawings', myDrawings);

    // // Watching any drawings being drawn by anybody
    //  myNewPath = new Path();
    // drawing.$watch(function(event) {
    //   console.log('this is key', event.key)
    //   var index = drawing.$indexFor(event.key)

    //   // if the drawing is not in my array, import the new drawing
    //   if(myArray.indexOf(event.key) === -1) {
    //     myNewPath.importJSON(drawing[index].$value);
    //     myArray.push(event.key)
    //     console.log('this is myArray', myArray)
    //   }
    // })
  });
  
  


  tool.onMouseUp = function onMouseUp () {
    drag = false;
    // myPath.simplify();
  };

  // When Firebase initially loaded to controller


});