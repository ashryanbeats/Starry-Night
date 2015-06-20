'use strict';

var app = angular.module('Meaniscule', ['ui.router', 'firebase', 'hmTouchEvents']);

app.config(function ($urlRouterProvider, $locationProvider) {
   // This turns off hashbang urls (/#about) and changes it to something normal (/about)
   $locationProvider.html5Mode(true);
   // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
   $urlRouterProvider.otherwise('/');
});
'use strict';

app.controller('HomeController', function ($scope, $http, $firebaseArray, DrawingFactory) {

  function initiate() {
    console.log('initiated!');
    paper.install(window);
    paper.setup('myCanvas');
  };

  initiate();

  var myPath;
  var drag = false;
  var tool = new Tool();
  var drawingRef = new Firebase('https://whereyourdrawinggetslost.firebaseio.com');
  var drawing = $firebaseArray(drawingRef);
  var myNewPath;
  var myArray = [];
  var drawingArray = [];
  var currentDrawingIndex = 0;

  $scope.msgFromScope = 'Try drawing something here!';

  drawing.$loaded().then(function (myDrawings) {

    tool.onMouseDown = function onMouseDown(event) {
      drag = true;
      myPath = new Path();
      myPath.strokeColor = 'white';
      myPath.add(event.point);
      var newPointArr = [event.point];
      drawing.$add(JSON.stringify(newPointArr)).then(function (drawingRef) {
        var id = drawingRef.key();
        currentDrawingIndex = drawing.$indexFor(id);
        console.log('this is the location in the array', drawing.$indexFor(id));
      });
    };

    tool.onMouseDrag = function onMouseDrag(event) {
      drag = true;
      myPath.add(event.point);

      var currentPointArr = JSON.parse(drawing[currentDrawingIndex]);
      currentPointArr.push(event.point);

      drawing[currentDrawingIndex] = JSON.stringify(currentPointArr);
      drawing.$save(currentDrawingIndex).then(function (ref) {
        var id = ref.key();
        console.log('firebase key', id);
        console.log('index of this key in our array', drawing.$indexFor(id));
      });

      console.log('this is drawingArray', drawingArray);
    };
    console.log('this is myDrawings', myDrawings);
  });

  tool.onMouseUp = function onMouseUp() {
    drag = false;
    // myPath.simplify();
  };

  // When Firebase initially loaded to controller
});
// currentDrawingIndex = drawingArray.push([event.point]) - 1;
// drawingArray[currentDrawingIndex].push(event.point);
// When YOU start drawing
// drawing.$add(event.point).then(function(drawingRef) {

//   var firebase_id = drawingRef.key();

//   console.log("added record with id" + firebase_id);
//   console.log('this is the location in the array', drawing.$indexFor(firebase_id));
//   myArray.push(firebase_id);
// });
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
"use strict";

app.factory("DrawingFactory", function ($http) {
  return {
    loadCanvas: function loadCanvas() {
      return $http.get("/").then(function (response) {
        return response.data;
      });
    }
  };
});
'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/app/home/home.html',
        controller: 'HomeController'
    });
});
"use strict";

app.directive("navbar", function () {
	return {
		restrict: "E",
		templateUrl: "/app/navbar/navbar.html"
	};
});
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZS9ob21lLWNhbnZhcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOztBQUVuRixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUU7O0FBRXpELG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMscUJBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3BDLENBQUMsQ0FBQzs7O0FDUEgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRTs7QUFFdkYsV0FBUyxRQUFRLEdBQUk7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixTQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RCLFNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekIsQ0FBQzs7QUFFRixVQUFRLEVBQUUsQ0FBQzs7QUFFWCxNQUFJLE1BQU0sQ0FBQztBQUNYLE1BQUksSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNqQixNQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3RCLE1BQUksVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7QUFDakYsTUFBSSxPQUFPLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLE1B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Q0o7R0FDRixDQUFBO0NBQ0YsQ0FBQyxDQUFDOzs7QUNUSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFO0FBQ2pDLGtCQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN6QixXQUFHLEVBQUUsR0FBRztBQUNSLG1CQUFXLEVBQUUscUJBQXFCO0FBQ2xDLGtCQUFVLEVBQUUsZ0JBQWdCO0tBQy9CLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7O0FDTkgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsWUFBVTtBQUNqQyxRQUFPO0FBQ04sVUFBUSxFQUFFLEdBQUc7QUFDYixhQUFXLEVBQUUseUJBQXlCO0VBQ3RDLENBQUM7Q0FDRixDQUFDLENBQUM7QUNMSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ01lYW5pc2N1bGUnLCBbJ3VpLnJvdXRlcicsICdmaXJlYmFzZScsICdobVRvdWNoRXZlbnRzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRmaXJlYmFzZUFycmF5LCBEcmF3aW5nRmFjdG9yeSkge1xuXG4gIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4gICAgY29uc29sZS5sb2coJ2luaXRpYXRlZCEnKTtcbiAgICBwYXBlci5pbnN0YWxsKHdpbmRvdyk7XG4gICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbiAgfTtcblxuICBpbml0aWF0ZSgpO1xuXG4gIHZhciBteVBhdGg7XG4gIHZhciBkcmFnID0gZmFsc2U7XG4gIHZhciB0b29sID0gbmV3IFRvb2woKTtcbiAgdmFyIGRyYXdpbmdSZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3doZXJleW91cmRyYXdpbmdnZXRzbG9zdC5maXJlYmFzZWlvLmNvbVwiKTtcbiAgdmFyIGRyYXdpbmcgPSAkZmlyZWJhc2VBcnJheShkcmF3aW5nUmVmKTtcbiAgdmFyIG15TmV3UGF0aDtcbiAgdmFyIG15QXJyYXkgPSBbXTtcbiAgdmFyIGRyYXdpbmdBcnJheSA9IFtdO1xuICB2YXIgY3VycmVudERyYXdpbmdJbmRleCA9IDA7XG5cbiAgJHNjb3BlLm1zZ0Zyb21TY29wZSA9IFwiVHJ5IGRyYXdpbmcgc29tZXRoaW5nIGhlcmUhXCI7XG5cbiAgZHJhd2luZy4kbG9hZGVkKCkudGhlbihmdW5jdGlvbihteURyYXdpbmdzKSB7XG4gICAgXG4gICAgdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duIChldmVudCkge1xuICAgICAgZHJhZyA9IHRydWU7XG4gICAgICBteVBhdGggPSBuZXcgUGF0aCgpO1xuICAgICAgbXlQYXRoLnN0cm9rZUNvbG9yID0gJ3doaXRlJztcbiAgICAgIG15UGF0aC5hZGQoZXZlbnQucG9pbnQpO1xuICAgICAgdmFyIG5ld1BvaW50QXJyID0gW2V2ZW50LnBvaW50XTtcbiAgICAgIGRyYXdpbmcuJGFkZChKU09OLnN0cmluZ2lmeShuZXdQb2ludEFycikpLnRoZW4oZnVuY3Rpb24oZHJhd2luZ1JlZikge1xuICAgICAgICB2YXIgaWQgPSBkcmF3aW5nUmVmLmtleSgpO1xuICAgICAgICBjdXJyZW50RHJhd2luZ0luZGV4ID0gZHJhd2luZy4kaW5kZXhGb3IoaWQpO1xuICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbG9jYXRpb24gaW4gdGhlIGFycmF5JywgZHJhd2luZy4kaW5kZXhGb3IoaWQpKVxuICAgICAgfSlcbiAgICAgIC8vIGN1cnJlbnREcmF3aW5nSW5kZXggPSBkcmF3aW5nQXJyYXkucHVzaChbZXZlbnQucG9pbnRdKSAtIDE7XG4gICAgICAgLy8gZHJhd2luZ0FycmF5W2N1cnJlbnREcmF3aW5nSW5kZXhdLnB1c2goZXZlbnQucG9pbnQpO1xuICAgIH07XG4gIFxuICAgIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbiBvbk1vdXNlRHJhZyAoZXZlbnQpIHtcbiAgICAgIGRyYWcgPSB0cnVlO1xuICAgICAgbXlQYXRoLmFkZChldmVudC5wb2ludCk7XG5cbiAgICAgIHZhciBjdXJyZW50UG9pbnRBcnIgPSBKU09OLnBhcnNlKGRyYXdpbmdbY3VycmVudERyYXdpbmdJbmRleF0pO1xuICAgICAgY3VycmVudFBvaW50QXJyLnB1c2goZXZlbnQucG9pbnQpO1xuXG4gICAgICBkcmF3aW5nW2N1cnJlbnREcmF3aW5nSW5kZXhdID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudFBvaW50QXJyKTtcbiAgICAgIGRyYXdpbmcuJHNhdmUoY3VycmVudERyYXdpbmdJbmRleCkudGhlbihmdW5jdGlvbihyZWYpIHtcbiAgICAgICAgICB2YXIgaWQgPSByZWYua2V5KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJmaXJlYmFzZSBrZXlcIiwgaWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5kZXggb2YgdGhpcyBrZXkgaW4gb3VyIGFycmF5XCIsIGRyYXdpbmcuJGluZGV4Rm9yKGlkKSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgZHJhd2luZ0FycmF5JywgZHJhd2luZ0FycmF5KVxuICAgICAgLy8gV2hlbiBZT1Ugc3RhcnQgZHJhd2luZ1xuICAgICAgLy8gZHJhd2luZy4kYWRkKGV2ZW50LnBvaW50KS50aGVuKGZ1bmN0aW9uKGRyYXdpbmdSZWYpIHtcbiAgICAgICAgXG4gICAgICAvLyAgIHZhciBmaXJlYmFzZV9pZCA9IGRyYXdpbmdSZWYua2V5KCk7XG4gICAgICAgIFxuICAgICAgLy8gICBjb25zb2xlLmxvZyhcImFkZGVkIHJlY29yZCB3aXRoIGlkXCIgKyBmaXJlYmFzZV9pZCk7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBsb2NhdGlvbiBpbiB0aGUgYXJyYXknLCBkcmF3aW5nLiRpbmRleEZvcihmaXJlYmFzZV9pZCkpO1xuICAgICAgLy8gICBteUFycmF5LnB1c2goZmlyZWJhc2VfaWQpO1xuICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICBjb25zb2xlLmxvZygndGhpcyBpcyBteURyYXdpbmdzJywgbXlEcmF3aW5ncylcbiAgICAvLyAvLyBkcmF3aW5nIHdoYXQgaXMgYWxyZWFkeSBpbiBmaXJlYmFzZVxuICAgIC8vIG15RHJhd2luZ3MuZm9yRWFjaChmdW5jdGlvbihlYWNoRHJhd2luZykge1xuICAgIC8vICAgbXlQYXRoID0gbmV3IFBhdGgoKTtcbiAgICAvLyAgIG15UGF0aC5pbXBvcnRKU09OKGVhY2hEcmF3aW5nLiR2YWx1ZSk7XG5cbiAgICAvLyAgIC8vIGtlZXAgaW4gdHJhY2sgb2YgdGhlIGluaXRpYWwgc2V0IG9mIGRyYXdpbmdzXG4gICAgLy8gICBteUFycmF5LnB1c2goZWFjaERyYXdpbmcuJGtleSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyBteURyYXdpbmdzJywgbXlEcmF3aW5ncyk7XG5cbiAgICAvLyAvLyBXYXRjaGluZyBhbnkgZHJhd2luZ3MgYmVpbmcgZHJhd24gYnkgYW55Ym9keVxuICAgIC8vICBteU5ld1BhdGggPSBuZXcgUGF0aCgpO1xuICAgIC8vIGRyYXdpbmcuJHdhdGNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygndGhpcyBpcyBrZXknLCBldmVudC5rZXkpXG4gICAgLy8gICB2YXIgaW5kZXggPSBkcmF3aW5nLiRpbmRleEZvcihldmVudC5rZXkpXG5cbiAgICAvLyAgIC8vIGlmIHRoZSBkcmF3aW5nIGlzIG5vdCBpbiBteSBhcnJheSwgaW1wb3J0IHRoZSBuZXcgZHJhd2luZ1xuICAgIC8vICAgaWYobXlBcnJheS5pbmRleE9mKGV2ZW50LmtleSkgPT09IC0xKSB7XG4gICAgLy8gICAgIG15TmV3UGF0aC5pbXBvcnRKU09OKGRyYXdpbmdbaW5kZXhdLiR2YWx1ZSk7XG4gICAgLy8gICAgIG15QXJyYXkucHVzaChldmVudC5rZXkpXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIG15QXJyYXknLCBteUFycmF5KVxuICAgIC8vICAgfVxuICAgIC8vIH0pXG4gIH0pO1xuICBcbiAgXG5cblxuICB0b29sLm9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcCAoKSB7XG4gICAgZHJhZyA9IGZhbHNlO1xuICAgIC8vIG15UGF0aC5zaW1wbGlmeSgpO1xuICB9O1xuXG4gIC8vIFdoZW4gRmlyZWJhc2UgaW5pdGlhbGx5IGxvYWRlZCB0byBjb250cm9sbGVyXG5cblxufSk7IiwiYXBwLmZhY3RvcnkoJ0RyYXdpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZENhbnZhczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChcIi9cIilcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICB9KTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJuYXZiYXJcIiwgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogXCJFXCIsXG5cdFx0dGVtcGxhdGVVcmw6IFwiL2FwcC9uYXZiYXIvbmF2YmFyLmh0bWxcIlxuXHR9O1xufSk7IiwiLy8gYXBwLmRpcmVjdGl2ZShcImhvbWUtY2FudmFzXCIsIGZ1bmN0aW9uICgpIHtcbi8vICAgcmV0dXJuIHtcbi8vICAgICByZXN0cmljdDogXCJBXCIsXG4vLyAgICAgbGluazogZnVuY3Rpb24gcG9zdExpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuLy8gICAgICAgdmFyIG15UGF0aDtcbi8vICAgICAgIHZhciBkcmFnID0gZmFsc2U7XG5cblxuLy8gICAgICAgZnVuY3Rpb24gb25Nb3VzZURvd24gKGV2ZW50KSB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgcHJlc3NlZCB0aGUgbW91c2UhJyk7XG4vLyAgICAgICAgIC8vIGRyYWcgPSB0cnVlO1xuLy8gICAgICAgICBteVBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuLy8gICAgICAgICBteVBhdGguc3Ryb2tlQ29sb3IgPSAnYmxhY2snO1xuLy8gICAgICAgICBteVBhdGguYWRkKGV2ZW50LnBvaW50KTtcbi8vICAgICAgICAgbXlQYXRoLnNpbXBsaWZ5KCk7XG4vLyAgICAgICB9O1xuXG4vLyAgICAgICBmdW5jdGlvbiBvbk1vdXNlRHJhZyAoZXZlbnQpIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ3lvdSBkcmFnZ2VkIHRoZSBtb3VzZSEnKTtcbi8vICAgICAgICAgLy8gZHJhZyA9IHRydWU7XG4vLyAgICAgICAgIG15UGF0aC5hZGQoZXZlbnQucG9pbnQpO1xuLy8gICAgICAgfTtcblxuLy8gICAgICAgZnVuY3Rpb24gb25Nb3VzZVVwICgpIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ1lvdSByZWxlYXNlZCB0aGUgbW91c2UhJyk7XG4vLyAgICAgICAgIC8vIGRyYWcgPSBmYWxzZTtcbi8vICAgICAgIH07XG5cbi8vICAgICAgIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKCdpbml0aWF0ZWQhJyk7XG4vLyAgICAgICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbi8vICAgICAgICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbi8vICAgICAgIH07XG5cbi8vICAgICAgIGVsZW1lbnQub24oJ21vdXNlZG93bicsIG9uTW91c2VEb3duKS5vbignbW91c2V1cCcsIG9uTW91c2VVcCkub24oJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKVxuLy8gICAgICAgaW5pdGlhdGUoKTtcblxuLy8gICAgIH1cbi8vICAgfTtcbi8vIH0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==