// app.directive("home-canvas", function () {
//   return {
//     restrict: "A",
//     link: function postLink (scope, element, attrs) {
//       var myPath;
//       var drag = false;


//       function onMouseDown (event) {
//         console.log('You pressed the mouse!');
//         // drag = true;
//         myPath = new paper.Path();
//         myPath.strokeColor = 'black';
//         myPath.add(event.point);
//         myPath.simplify();
//       };

//       function onMouseDrag (event) {
//         console.log('you dragged the mouse!');
//         // drag = true;
//         myPath.add(event.point);
//       };

//       function onMouseUp () {
//         console.log('You released the mouse!');
//         // drag = false;
//       };

//       function initiate () { 
//         console.log('initiated!');
//         paper.install(window);
//         paper.setup("myCanvas");
//       };

//       element.on('mousedown', onMouseDown).on('mouseup', onMouseUp).on('mousemove', onMouseDrag)
//       initiate();

//     }
//   };
// });