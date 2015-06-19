'use strict';

var app = angular.module('Meaniscule', ['ui.router', 'firebase', 'hmTouchEvents']);

app.config(function ($urlRouterProvider, $locationProvider) {
   // This turns off hashbang urls (/#about) and changes it to something normal (/about)
   $locationProvider.html5Mode(true);
   // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
   $urlRouterProvider.otherwise('/');
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
'use strict';

app.controller('HomeController', function ($scope, $http, $firebaseObject) {

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
  var drawing = $firebaseObject(drawingRef);
  // drawing.foo = "bar";
  $scope.drawTogether = drawing;
  //load drawings

  // drawing.$save().then(function (drawingRef) {
  //   console.log('hello');
  // });

  // drawing.$bindTo($scope, "drawTogether");

  $scope.msgFromScope = 'Try drawing something here!';

  tool.onMouseDown = function onMouseDown(event) {
    drag = true;
    myPath = new Path();
    myPath.strokeColor = 'white';
    myPath.add(event.point);
    // project.view.zoom = 1;
  };

  tool.onMouseDrag = function onMouseDrag(event) {
    drag = true;
    myPath.add(event.point);
  };

  tool.onMouseUp = function onMouseUp() {
    drag = false;
    myPath.simplify();
    drawing.myPath = myPath.exportJSON();

    drawing.$save().then(function (drawingRef) {
      console.log('hello');
      console.log('this is drawing importJSON', myPath.importJSON(drawing.myPath));
    })['catch'](function (err) {
      console.error(err);
    });
  };

  $scope.drawTogether.$loaded().then(function () {
    console.log('loaded record:', $scope.drawTogether);
  })['catch'](function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRpcmVjdGl2ZS9ob21lLWNhbnZhcy5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLnN0YXRlLmpzIiwibmF2YmFyL25hdmJhci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFbkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFOztBQUV6RCxvQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxDLHFCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQyxDQUFDLENBQUM7QUNQSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4Q0EsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFOztBQUV4RSxXQUFTLFFBQVEsR0FBSTtBQUNuQixXQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLFNBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsU0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN6QixDQUFDOztBQUVGLFVBQVEsRUFBRSxDQUFDOztBQUVYLE1BQUksTUFBTSxDQUFDO0FBQ1gsTUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdEIsTUFBSSxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsaURBQWlELENBQUMsQ0FBQztBQUNqRixNQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTFDLFFBQU0sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7QUFTOUIsUUFBTSxDQUFDLFlBQVksR0FBRyw2QkFBNkIsQ0FBQzs7QUFFcEQsTUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsQ0FBRSxLQUFLLEVBQUU7QUFDOUMsUUFBSSxHQUFHLElBQUksQ0FBQztBQUNaLFVBQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3BCLFVBQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQzdCLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztHQUV6QixDQUFDOztBQUVGLE1BQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLENBQUUsS0FBSyxFQUFFO0FBQzlDLFFBQUksR0FBRyxJQUFJLENBQUM7QUFDWixVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6QixDQUFDOztBQUVGLE1BQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEdBQUk7QUFDckMsUUFBSSxHQUFHLEtBQUssQ0FBQztBQUNiLFVBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNsQixXQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFckMsV0FBTyxDQUFDLEtBQUssRUFBRSxDQUNaLElBQUksQ0FBQyxVQUFVLFVBQVUsRUFBRTtBQUMxQixhQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLGFBQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUM5RSxDQUFDLFNBQ0ksQ0FBQyxVQUFTLEdBQUcsRUFBRTtBQUNuQixhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCLENBQUMsQ0FBQztHQUNOLENBQUM7O0FBRUYsUUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FDMUIsSUFBSSxDQUFDLFlBQVc7QUFDZixXQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNwRCxDQUFDLFNBQ0ksQ0FBQyxVQUFTLEdBQUcsRUFBRTtBQUNuQixXQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3BCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Q0FhTixDQUFDLENBQUM7OztBQzFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFO0FBQ2pDLGtCQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN6QixXQUFHLEVBQUUsR0FBRztBQUNSLG1CQUFXLEVBQUUscUJBQXFCO0FBQ2xDLGtCQUFVLEVBQUUsZ0JBQWdCO0tBQy9CLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7O0FDTkgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsWUFBVTtBQUNqQyxRQUFPO0FBQ04sVUFBUSxFQUFFLEdBQUc7QUFDYixhQUFXLEVBQUUseUJBQXlCO0VBQ3RDLENBQUM7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnTWVhbmlzY3VsZScsIFsndWkucm91dGVyJywgJ2ZpcmViYXNlJywgJ2htVG91Y2hFdmVudHMnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiLy8gYXBwLmRpcmVjdGl2ZShcImhvbWUtY2FudmFzXCIsIGZ1bmN0aW9uICgpIHtcbi8vICAgcmV0dXJuIHtcbi8vICAgICByZXN0cmljdDogXCJBXCIsXG4vLyAgICAgbGluazogZnVuY3Rpb24gcG9zdExpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuLy8gICAgICAgdmFyIG15UGF0aDtcbi8vICAgICAgIHZhciBkcmFnID0gZmFsc2U7XG5cblxuLy8gICAgICAgZnVuY3Rpb24gb25Nb3VzZURvd24gKGV2ZW50KSB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgcHJlc3NlZCB0aGUgbW91c2UhJyk7XG4vLyAgICAgICAgIC8vIGRyYWcgPSB0cnVlO1xuLy8gICAgICAgICBteVBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuLy8gICAgICAgICBteVBhdGguc3Ryb2tlQ29sb3IgPSAnYmxhY2snO1xuLy8gICAgICAgICBteVBhdGguYWRkKGV2ZW50LnBvaW50KTtcbi8vICAgICAgICAgbXlQYXRoLnNpbXBsaWZ5KCk7XG4vLyAgICAgICB9O1xuXG4vLyAgICAgICBmdW5jdGlvbiBvbk1vdXNlRHJhZyAoZXZlbnQpIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ3lvdSBkcmFnZ2VkIHRoZSBtb3VzZSEnKTtcbi8vICAgICAgICAgLy8gZHJhZyA9IHRydWU7XG4vLyAgICAgICAgIG15UGF0aC5hZGQoZXZlbnQucG9pbnQpO1xuLy8gICAgICAgfTtcblxuLy8gICAgICAgZnVuY3Rpb24gb25Nb3VzZVVwICgpIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ1lvdSByZWxlYXNlZCB0aGUgbW91c2UhJyk7XG4vLyAgICAgICAgIC8vIGRyYWcgPSBmYWxzZTtcbi8vICAgICAgIH07XG5cbi8vICAgICAgIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKCdpbml0aWF0ZWQhJyk7XG4vLyAgICAgICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbi8vICAgICAgICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbi8vICAgICAgIH07XG5cbi8vICAgICAgIGVsZW1lbnQub24oJ21vdXNlZG93bicsIG9uTW91c2VEb3duKS5vbignbW91c2V1cCcsIG9uTW91c2VVcCkub24oJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKVxuLy8gICAgICAgaW5pdGlhdGUoKTtcblxuLy8gICAgIH1cbi8vICAgfTtcbi8vIH0pOyIsImFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRmaXJlYmFzZU9iamVjdCkge1xuXG4gIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4gICAgY29uc29sZS5sb2coJ2luaXRpYXRlZCEnKTtcbiAgICBwYXBlci5pbnN0YWxsKHdpbmRvdyk7XG4gICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbiAgfTtcblxuICBpbml0aWF0ZSgpO1xuXG4gIHZhciBteVBhdGg7XG4gIHZhciBkcmFnID0gZmFsc2U7XG4gIHZhciB0b29sID0gbmV3IFRvb2woKTtcbiAgdmFyIGRyYXdpbmdSZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3doZXJleW91cmRyYXdpbmdnZXRzbG9zdC5maXJlYmFzZWlvLmNvbVwiKTtcbiAgdmFyIGRyYXdpbmcgPSAkZmlyZWJhc2VPYmplY3QoZHJhd2luZ1JlZik7XG4gIC8vIGRyYXdpbmcuZm9vID0gXCJiYXJcIjtcbiAgJHNjb3BlLmRyYXdUb2dldGhlciA9IGRyYXdpbmc7XG4gIC8vbG9hZCBkcmF3aW5nc1xuXG4gIC8vIGRyYXdpbmcuJHNhdmUoKS50aGVuKGZ1bmN0aW9uIChkcmF3aW5nUmVmKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ2hlbGxvJyk7XG4gIC8vIH0pO1xuXG4gIC8vIGRyYXdpbmcuJGJpbmRUbygkc2NvcGUsIFwiZHJhd1RvZ2V0aGVyXCIpO1xuXG4gICRzY29wZS5tc2dGcm9tU2NvcGUgPSBcIlRyeSBkcmF3aW5nIHNvbWV0aGluZyBoZXJlIVwiO1xuICBcbiAgdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duIChldmVudCkge1xuICAgIGRyYWcgPSB0cnVlO1xuICAgIG15UGF0aCA9IG5ldyBQYXRoKCk7XG4gICAgbXlQYXRoLnN0cm9rZUNvbG9yID0gJ3doaXRlJztcbiAgICBteVBhdGguYWRkKGV2ZW50LnBvaW50KTtcbiAgICAvLyBwcm9qZWN0LnZpZXcuem9vbSA9IDE7XG4gIH07XG5cbiAgdG9vbC5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIG9uTW91c2VEcmFnIChldmVudCkge1xuICAgIGRyYWcgPSB0cnVlO1xuICAgIG15UGF0aC5hZGQoZXZlbnQucG9pbnQpO1xuICB9O1xuXG4gIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24gb25Nb3VzZVVwICgpIHtcbiAgICBkcmFnID0gZmFsc2U7XG4gICAgbXlQYXRoLnNpbXBsaWZ5KCk7XG4gICAgZHJhd2luZy5teVBhdGggPSBteVBhdGguZXhwb3J0SlNPTigpO1xuXG4gICAgZHJhd2luZy4kc2F2ZSgpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZHJhd2luZ1JlZikge1xuICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8nKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgZHJhd2luZyBpbXBvcnRKU09OJywgbXlQYXRoLmltcG9ydEpTT04oZHJhd2luZy5teVBhdGgpKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5kcmF3VG9nZXRoZXIuJGxvYWRlZCgpXG4gICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImxvYWRlZCByZWNvcmQ6XCIsICRzY29wZS5kcmF3VG9nZXRoZXIpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuXG5cbiAgLy9uZWVkIHRvIG5vdCBtYWtlIHRoZSB1c2VyIGRyYXcgd2hlbiB6b29taW5nIGluXG4gIC8vbmVlZCB0byByZWNvbmZpZ3VyZSBzaXplIGFuZCBjZW50ZXJcbiAgLy8gdmFyIGNhbnZhc1NpemUgPSBwcm9qZWN0LnZpZXcuc2l6ZTtcbiAgLy8gdmFyIGNlbnRlciA9IHByb2plY3Qudmlldy5jZW50ZXI7XG5cbiAgLy9ldmVyeSB0aW1lIGJ1dHRvbiBpcyBjbGlja2VkIHpvb20gaW4gbW9yZTtcbiAgLy8gJHNjb3BlLnpvb20gPSBwcm9qZWN0LnZpZXcuem9vbSA9IGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xuICAvLyAgIHByb2plY3Qudmlldy56b29tID0gMTtcbiAgLy8gfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICB9KTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJuYXZiYXJcIiwgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogXCJFXCIsXG5cdFx0dGVtcGxhdGVVcmw6IFwiL2FwcC9uYXZiYXIvbmF2YmFyLmh0bWxcIlxuXHR9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9