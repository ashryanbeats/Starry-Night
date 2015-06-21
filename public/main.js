'use strict';

var app = angular.module('Meaniscule', ['ui.router', 'firebase', 'hmTouchEvents']);

app.config(function ($urlRouterProvider, $locationProvider) {
   // This turns off hashbang urls (/#about) and changes it to something normal (/about)
   $locationProvider.html5Mode(true);
   // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
   $urlRouterProvider.otherwise('/');
});
'use strict';

app.controller('HomeController', function ($scope, $http, $firebaseArray) {
  var socket = io();

  function initiate() {
    console.log('initiated!');
    paper.install(window);
    paper.setup('myCanvas');
  };

  initiate();

  var tool = new Tool();
  // var drawingRef = new Firebase("https://whereyourdrawinggetslost.firebaseio.com");
  // var drawing = $firebaseArray(drawingRef);

  tool.minDistance = 10;
  tool.maxDistance = 45;

  var stroke;

  tool.onMouseDown = function (event) {
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);
  };

  tool.onMouseDrag = function (event) {
    var step = event.delta.divide(2);
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();
  };

  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  };

  var moon = new Path.Circle({
    center: new Point(50, 50),
    radius: 30,
    fillColor: 'yellow',
    opacity: 0.7
  });

  // moon.removeSegment(2);
  // moon.smooth();
  // moon.rotate(-40);

  // var center = new Point(50, 50);
  var center = view.center;
  var points = 5;
  var radius1 = 5;
  var radius2 = 10;
  var star = new Path.Star(center, points, radius1, radius2);

  star.style = {
    fillColor: 'yellow'
  };

  var starArr = [];
  for (var i = 0; i < 100; i++) {
    var starCopy = star.clone();
    var randomPosition = Point.random();
    randomPosition.x = randomPosition.x * view.size._width;
    randomPosition.y = randomPosition.y * view.size._height;
    starCopy.position = randomPosition;
    starCopy.rotate(Math.random() * 20);
    starCopy.scale(0.25 + Math.random() * 0.75);
    starCopy.onMouseMove = function (event) {
      this.opacity = Math.random();
    };
    starArr.push(starCopy);
  }

  star.remove();

  var randomPosition2 = Point.random();
  randomPosition2.x = randomPosition2.x * view.size._width;
  randomPosition2.y = randomPosition2.y * view.size._height;
  var destination = randomPosition2;
  console.log('this is destination', destination);

  view.onFrame = function (event) {
    for (var i = 0; i < starArr.length; i++) {
      starArr[i].fillColor.hue += (1 - Math.round(Math.random()) * 2) * (Math.random() * 5);
      starArr[i].rotate(Math.random());
      starArr[i].position.x += starArr[i].bounds.width / 500;
      if (starArr[i].bounds.left > view.size.width) {
        starArr[i].position.x = -starArr[i].bounds.width;
      }
    }
  };

  socket.emit('sendtheNight', project);

  socket.on('gotIt', function (data) {
    console.log('yay', data);
  });
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOztBQUVuRixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUU7O0FBRXpELG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMscUJBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3BDLENBQUMsQ0FBQzs7O0FDUEgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO0FBQ3ZFLE1BQUksTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDOztBQUVsQixXQUFTLFFBQVEsR0FBSTtBQUNuQixXQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLFNBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsU0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN6QixDQUFDOztBQUVGLFVBQVEsRUFBRSxDQUFDOztBQUVYLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7Ozs7QUFJdEIsTUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLE1BQUksTUFBTSxDQUFDOztBQUVYLE1BQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDbEMsVUFBTSxHQUFHLElBQUks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QUFFLHlCQUF5QjtFQUN0QyxDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ01lYW5pc2N1bGUnLCBbJ3VpLnJvdXRlcicsICdmaXJlYmFzZScsICdobVRvdWNoRXZlbnRzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRmaXJlYmFzZUFycmF5KSB7XG4gIHZhciBzb2NrZXQgPSBpbygpO1xuXG4gIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4gICAgY29uc29sZS5sb2coJ2luaXRpYXRlZCEnKTtcbiAgICBwYXBlci5pbnN0YWxsKHdpbmRvdyk7XG4gICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbiAgfTtcblxuICBpbml0aWF0ZSgpO1xuXG4gIHZhciB0b29sID0gbmV3IFRvb2woKTtcbiAgLy8gdmFyIGRyYXdpbmdSZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3doZXJleW91cmRyYXdpbmdnZXRzbG9zdC5maXJlYmFzZWlvLmNvbVwiKTtcbiAgLy8gdmFyIGRyYXdpbmcgPSAkZmlyZWJhc2VBcnJheShkcmF3aW5nUmVmKTtcblxuICB0b29sLm1pbkRpc3RhbmNlID0gMTA7XG4gIHRvb2wubWF4RGlzdGFuY2UgPSA0NTtcblxuICB2YXIgc3Ryb2tlO1xuXG4gIHRvb2wub25Nb3VzZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBzdHJva2UgPSBuZXcgUGF0aCgpO1xuICAgIHN0cm9rZS5maWxsQ29sb3IgPSB7XG4gICAgICBodWU6IE1hdGgucmFuZG9tKCkgKiAzNjAsXG4gICAgICBzYXR1cmF0aW9uOiAxLFxuICAgICAgYnJpZ2h0bmVzczogMVxuICAgIH07XG4gICAgc3Ryb2tlLmFkZChldmVudC5wb2ludCk7XG4gIH1cblxuICB0b29sLm9uTW91c2VEcmFnID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHN0ZXAgPSBldmVudC5kZWx0YS5kaXZpZGUoMilcbiAgICBzdGVwLmFuZ2xlICs9IDkwO1xuXG4gICAgdmFyIHRvcCA9IGV2ZW50Lm1pZGRsZVBvaW50LmFkZChzdGVwKTtcbiAgICB2YXIgYm90dG9tID0gZXZlbnQubWlkZGxlUG9pbnQuc3VidHJhY3Qoc3RlcCk7XG5cbiAgICBzdHJva2UuYWRkKHRvcCk7XG4gICAgc3Ryb2tlLmluc2VydCgwLCBib3R0b20pO1xuICAgIHN0cm9rZS5zbW9vdGgoKTtcbiAgfVxuXG5cbiAgdG9vbC5vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcbiAgICBzdHJva2UuY2xvc2VkID0gdHJ1ZTtcbiAgICBzdHJva2Uuc21vb3RoKCk7XG4gIH1cblxuXG4gIHZhciBtb29uID0gbmV3IFBhdGguQ2lyY2xlKHtcbiAgICBjZW50ZXI6IG5ldyBQb2ludCg1MCwgNTApLFxuICAgIHJhZGl1czogMzAsXG4gICAgZmlsbENvbG9yOiAneWVsbG93JyxcbiAgICBvcGFjaXR5OiAwLjdcbiAgfSk7XG5cbiAgLy8gbW9vbi5yZW1vdmVTZWdtZW50KDIpO1xuICAvLyBtb29uLnNtb290aCgpO1xuICAvLyBtb29uLnJvdGF0ZSgtNDApO1xuXG4gIC8vIHZhciBjZW50ZXIgPSBuZXcgUG9pbnQoNTAsIDUwKTtcbiAgdmFyIGNlbnRlciA9IHZpZXcuY2VudGVyO1xuICB2YXIgcG9pbnRzID0gNTtcbiAgdmFyIHJhZGl1czEgPSA1O1xuICB2YXIgcmFkaXVzMiA9IDEwO1xuICB2YXIgc3RhciA9IG5ldyBQYXRoLlN0YXIoY2VudGVyLCBwb2ludHMsIHJhZGl1czEsIHJhZGl1czIpO1xuICBcbiAgc3Rhci5zdHlsZSA9IHtcbiAgICBmaWxsQ29sb3I6ICd5ZWxsb3cnXG4gIH1cblxuICB2YXIgc3RhckFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgdmFyIHN0YXJDb3B5ID0gc3Rhci5jbG9uZSgpO1xuICAgIHZhciByYW5kb21Qb3NpdGlvbiA9IFBvaW50LnJhbmRvbSgpO1xuICAgIHJhbmRvbVBvc2l0aW9uLnggPSByYW5kb21Qb3NpdGlvbi54ICogdmlldy5zaXplLl93aWR0aDtcbiAgICByYW5kb21Qb3NpdGlvbi55ID0gcmFuZG9tUG9zaXRpb24ueSAqIHZpZXcuc2l6ZS5faGVpZ2h0O1xuICAgIHN0YXJDb3B5LnBvc2l0aW9uID0gcmFuZG9tUG9zaXRpb247XG4gICAgc3RhckNvcHkucm90YXRlKE1hdGgucmFuZG9tKCkgKiAyMCk7XG4gICAgc3RhckNvcHkuc2NhbGUoMC4yNSArIE1hdGgucmFuZG9tKCkgKiAwLjc1KTtcbiAgICBzdGFyQ29weS5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm9wYWNpdHkgPSBNYXRoLnJhbmRvbSgpO1xuICAgIH1cbiAgICBzdGFyQXJyLnB1c2goc3RhckNvcHkpO1xuICB9XG5cbiAgc3Rhci5yZW1vdmUoKTtcblxuICB2YXIgcmFuZG9tUG9zaXRpb24yID0gUG9pbnQucmFuZG9tKCk7XG4gIHJhbmRvbVBvc2l0aW9uMi54ID0gcmFuZG9tUG9zaXRpb24yLnggKiB2aWV3LnNpemUuX3dpZHRoO1xuICByYW5kb21Qb3NpdGlvbjIueSA9IHJhbmRvbVBvc2l0aW9uMi55ICogdmlldy5zaXplLl9oZWlnaHQ7XG4gIHZhciBkZXN0aW5hdGlvbiA9IHJhbmRvbVBvc2l0aW9uMjtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgZGVzdGluYXRpb24nLCBkZXN0aW5hdGlvbik7XG5cbiAgdmlldy5vbkZyYW1lID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHN0YXJBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJBcnJbaV0uZmlsbENvbG9yLmh1ZSArPSAgKDEgLSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpICogMikgKiAoTWF0aC5yYW5kb20oKSAqIDUpO1xuICAgICAgc3RhckFycltpXS5yb3RhdGUoTWF0aC5yYW5kb20oKSk7XG4gICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggKz0gc3RhckFycltpXS5ib3VuZHMud2lkdGggLyA1MDA7XG4gICAgICBpZiAoc3RhckFycltpXS5ib3VuZHMubGVmdCA+IHZpZXcuc2l6ZS53aWR0aCkge1xuICAgICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggPSAtc3RhckFycltpXS5ib3VuZHMud2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc29ja2V0LmVtaXQoJ3NlbmR0aGVOaWdodCcsIHByb2plY3QpO1xuXG4gIHNvY2tldC5vbignZ290SXQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ3lheScsIGRhdGEpO1xuICB9KVxuXG59KTsiLCJhcHAuZmFjdG9yeSgnRHJhd2luZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgcmV0dXJuIHtcbiAgICBsb2FkQ2FudmFzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL1wiKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgIH0pO1xufSk7IiwiYXBwLmRpcmVjdGl2ZShcIm5hdmJhclwiLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiBcIkVcIixcblx0XHR0ZW1wbGF0ZVVybDogXCIvYXBwL25hdmJhci9uYXZiYXIuaHRtbFwiXG5cdH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=