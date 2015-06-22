'use strict';

var app = angular.module('Meaniscule', ['ui.router', 'firebase']);

app.config(function ($urlRouterProvider, $locationProvider) {
   // This turns off hashbang urls (/#about) and changes it to something normal (/about)
   $locationProvider.html5Mode(true);
   // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
   $urlRouterProvider.otherwise('/');
});
'use strict';

app.controller('HomeController', function ($scope, $http) {
  var socket = io();

  function initiate() {
    console.log('initiated!');
    paper.install(window);
    paper.setup('myCanvas');
  };

  initiate();

  //Drawing on the night sky
  var tool = new Tool();
  tool.minDistance = 10;
  tool.maxDistance = 45;

  var stroke;
  var path_to_send = {};

  tool.onMouseDown = function (event) {
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);

    //defining what to send via sockets
    path_to_send = {
      color: stroke.fillColor,
      start: event.point,
      stroke: []
    };
  };

  tool.onMouseDrag = function (event) {
    var step = event.delta.divide(2);
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();

    path_to_send.stroke.push({
      top: top,
      bottom: bottom
    });

    //emitting my drawing
    socket.emit('meDrawing', JSON.stringify(path_to_send));
  };

  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  };

  // When someone else starts drawing
  socket.on('friendsDrawing', function (data) {
    console.log('friendsDrawing', JSON.parse(data));
  });

  //referencing https://github.com/byrichardpowell/draw/blob/master/public/javascripts/canvas.js
  //for drawing a path in real time

  // var path = {}
  // var progress_external_path = function(points) {

  //   //if there is currently no path, start the path
  //   if(!path) {
  //     external_paths = new Path();
  //     path = external_paths;

  //   //starting the path
  //     var start_point = new Point(points.start.x, points.start.y);
  //     path.fillColor = {
  //       hue: Math.random() * 360,
  //       saturation: 1,
  //       brightness: 1
  //     };
  //     path.add(start_point);     
  //   }

  //   var paths = points.path;

  //   for(var i = 0; i < paths.length; i++) {
  //     path.add(paths[i].top);
  //     path.insert(0, paths[i].bottom);
  //   }

  //   path.smooth();
  //   view.draw();
  // }

  //referencing https://groups.google.com/forum/#!topic/paperjs/cmQFQNTVABg
  //view.update called in socket listener
  //might conflict with the progress_external_path from above

  // socket.on('friendsDrawing', function(data) {
  //   JSON.parse(data);
  //   view.update();
  // });

  //Putting stars on the night sky
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

  //project refers the work done on the canvas 
  console.log('this is the project', project);
  socket.emit('sendtheNight', project);
  // exporting functions to use in server/app/index.js
  // module.exports = progress_external_path;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRTs7QUFFekQsb0JBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQyxxQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUNQSCxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUN2RCxNQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQzs7QUFFbEIsV0FBUyxRQUFRLEdBQUk7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixTQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RCLFNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekIsQ0FBQzs7QUFFRixVQUFRLEVBQUUsQ0FBQzs7O0FBR1gsTUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN0QixNQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsTUFBSSxNQUFNLENBQUM7QUFDWCxNQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7O0FBRXRCLE1BQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDbEMsVUFBTSxH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Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ01lYW5pc2N1bGUnLCBbJ3VpLnJvdXRlcicsICdmaXJlYmFzZSddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4gIHZhciBzb2NrZXQgPSBpbygpO1xuICBcbiAgZnVuY3Rpb24gaW5pdGlhdGUgKCkgeyBcbiAgICBjb25zb2xlLmxvZygnaW5pdGlhdGVkIScpO1xuICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbiAgICBwYXBlci5zZXR1cChcIm15Q2FudmFzXCIpO1xuICB9O1xuXG4gIGluaXRpYXRlKCk7XG5cbiAgLy9EcmF3aW5nIG9uIHRoZSBuaWdodCBza3lcbiAgdmFyIHRvb2wgPSBuZXcgVG9vbCgpO1xuICB0b29sLm1pbkRpc3RhbmNlID0gMTA7XG4gIHRvb2wubWF4RGlzdGFuY2UgPSA0NTtcblxuICB2YXIgc3Ryb2tlO1xuICB2YXIgcGF0aF90b19zZW5kID0ge307XG5cbiAgdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZSA9IG5ldyBQYXRoKCk7XG4gICAgc3Ryb2tlLmZpbGxDb2xvciA9IHtcbiAgICAgIGh1ZTogTWF0aC5yYW5kb20oKSAqIDM2MCxcbiAgICAgIHNhdHVyYXRpb246IDEsXG4gICAgICBicmlnaHRuZXNzOiAxXG4gICAgfTtcbiAgICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcblxuICAvL2RlZmluaW5nIHdoYXQgdG8gc2VuZCB2aWEgc29ja2V0c1xuICAgIHBhdGhfdG9fc2VuZCA9IHtcbiAgICAgIGNvbG9yOiBzdHJva2UuZmlsbENvbG9yLFxuICAgICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAgICAgc3Ryb2tlOiBbXVxuICAgIH1cbiAgfVxuXG4gIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc3RlcCA9IGV2ZW50LmRlbHRhLmRpdmlkZSgyKVxuICAgIHN0ZXAuYW5nbGUgKz0gOTA7XG5cbiAgICB2YXIgdG9wID0gZXZlbnQubWlkZGxlUG9pbnQuYWRkKHN0ZXApO1xuICAgIHZhciBib3R0b20gPSBldmVudC5taWRkbGVQb2ludC5zdWJ0cmFjdChzdGVwKTtcblxuICAgIHN0cm9rZS5hZGQodG9wKTtcbiAgICBzdHJva2UuaW5zZXJ0KDAsIGJvdHRvbSk7XG4gICAgc3Ryb2tlLnNtb290aCgpO1xuXG4gICAgcGF0aF90b19zZW5kLnN0cm9rZS5wdXNoKHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgYm90dG9tOiBib3R0b21cbiAgICB9KTtcblxuICAgIC8vZW1pdHRpbmcgbXkgZHJhd2luZ1xuICAgIHNvY2tldC5lbWl0KCdtZURyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShwYXRoX3RvX3NlbmQpKTtcbiAgfVxuXG4gIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgc3Ryb2tlLmFkZChldmVudC5wb2ludCk7XG4gICAgc3Ryb2tlLmNsb3NlZCA9IHRydWU7XG4gICAgc3Ryb2tlLnNtb290aCgpO1xuICB9XG5cbiAgLy8gV2hlbiBzb21lb25lIGVsc2Ugc3RhcnRzIGRyYXdpbmdcbiAgc29ja2V0Lm9uKCdmcmllbmRzRHJhd2luZycsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmcmllbmRzRHJhd2luZycsSlNPTi5wYXJzZShkYXRhKSk7XG4gIH0pO1xuXG5cbiAgLy9yZWZlcmVuY2luZyBodHRwczovL2dpdGh1Yi5jb20vYnlyaWNoYXJkcG93ZWxsL2RyYXcvYmxvYi9tYXN0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NhbnZhcy5qc1xuICAvL2ZvciBkcmF3aW5nIGEgcGF0aCBpbiByZWFsIHRpbWVcblxuICAvLyB2YXIgcGF0aCA9IHt9XG4gIC8vIHZhciBwcm9ncmVzc19leHRlcm5hbF9wYXRoID0gZnVuY3Rpb24ocG9pbnRzKSB7XG5cbiAgLy8gICAvL2lmIHRoZXJlIGlzIGN1cnJlbnRseSBubyBwYXRoLCBzdGFydCB0aGUgcGF0aFxuICAvLyAgIGlmKCFwYXRoKSB7XG4gIC8vICAgICBleHRlcm5hbF9wYXRocyA9IG5ldyBQYXRoKCk7XG4gIC8vICAgICBwYXRoID0gZXh0ZXJuYWxfcGF0aHM7XG5cbiAgLy8gICAvL3N0YXJ0aW5nIHRoZSBwYXRoXG4gIC8vICAgICB2YXIgc3RhcnRfcG9pbnQgPSBuZXcgUG9pbnQocG9pbnRzLnN0YXJ0LngsIHBvaW50cy5zdGFydC55KTtcbiAgLy8gICAgIHBhdGguZmlsbENvbG9yID0ge1xuICAvLyAgICAgICBodWU6IE1hdGgucmFuZG9tKCkgKiAzNjAsXG4gIC8vICAgICAgIHNhdHVyYXRpb246IDEsXG4gIC8vICAgICAgIGJyaWdodG5lc3M6IDFcbiAgLy8gICAgIH07XG4gIC8vICAgICBwYXRoLmFkZChzdGFydF9wb2ludCk7ICAgICAgXG4gIC8vICAgfVxuXG4gIC8vICAgdmFyIHBhdGhzID0gcG9pbnRzLnBhdGg7XG5cbiAgLy8gICBmb3IodmFyIGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgIHBhdGguYWRkKHBhdGhzW2ldLnRvcCk7XG4gIC8vICAgICBwYXRoLmluc2VydCgwLCBwYXRoc1tpXS5ib3R0b20pO1xuICAvLyAgIH1cblxuICAvLyAgIHBhdGguc21vb3RoKCk7XG4gIC8vICAgdmlldy5kcmF3KCk7XG4gIC8vIH1cblxuICAvL3JlZmVyZW5jaW5nIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyF0b3BpYy9wYXBlcmpzL2NtUUZRTlRWQUJnXG4gIC8vdmlldy51cGRhdGUgY2FsbGVkIGluIHNvY2tldCBsaXN0ZW5lclxuICAvL21pZ2h0IGNvbmZsaWN0IHdpdGggdGhlIHByb2dyZXNzX2V4dGVybmFsX3BhdGggZnJvbSBhYm92ZVxuXG4gIC8vIHNvY2tldC5vbignZnJpZW5kc0RyYXdpbmcnLCBmdW5jdGlvbihkYXRhKSB7XG4gIC8vICAgSlNPTi5wYXJzZShkYXRhKTtcbiAgLy8gICB2aWV3LnVwZGF0ZSgpO1xuICAvLyB9KTtcblxuXG5cblxuICAvL1B1dHRpbmcgc3RhcnMgb24gdGhlIG5pZ2h0IHNreVxuICB2YXIgY2VudGVyID0gdmlldy5jZW50ZXI7XG4gIHZhciBwb2ludHMgPSA1O1xuICB2YXIgcmFkaXVzMSA9IDU7XG4gIHZhciByYWRpdXMyID0gMTA7XG4gIHZhciBzdGFyID0gbmV3IFBhdGguU3RhcihjZW50ZXIsIHBvaW50cywgcmFkaXVzMSwgcmFkaXVzMik7XG4gIFxuICBzdGFyLnN0eWxlID0ge1xuICAgIGZpbGxDb2xvcjogJ3llbGxvdydcbiAgfVxuXG4gIHZhciBzdGFyQXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICB2YXIgc3RhckNvcHkgPSBzdGFyLmNsb25lKCk7XG4gICAgdmFyIHJhbmRvbVBvc2l0aW9uID0gUG9pbnQucmFuZG9tKCk7XG4gICAgcmFuZG9tUG9zaXRpb24ueCA9IHJhbmRvbVBvc2l0aW9uLnggKiB2aWV3LnNpemUuX3dpZHRoO1xuICAgIHJhbmRvbVBvc2l0aW9uLnkgPSByYW5kb21Qb3NpdGlvbi55ICogdmlldy5zaXplLl9oZWlnaHQ7XG4gICAgc3RhckNvcHkucG9zaXRpb24gPSByYW5kb21Qb3NpdGlvbjtcbiAgICBzdGFyQ29weS5yb3RhdGUoTWF0aC5yYW5kb20oKSAqIDIwKTtcbiAgICBzdGFyQ29weS5zY2FsZSgwLjI1ICsgTWF0aC5yYW5kb20oKSAqIDAuNzUpO1xuICAgIHN0YXJDb3B5Lm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHRoaXMub3BhY2l0eSA9IE1hdGgucmFuZG9tKCk7XG4gICAgfVxuICAgIHN0YXJBcnIucHVzaChzdGFyQ29weSk7XG4gIH1cblxuICBzdGFyLnJlbW92ZSgpO1xuXG4gIHZpZXcub25GcmFtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzdGFyQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdGFyQXJyW2ldLmZpbGxDb2xvci5odWUgKz0gICgxIC0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSAqIDIpICogKE1hdGgucmFuZG9tKCkgKiA1KTtcbiAgICAgIHN0YXJBcnJbaV0ucm90YXRlKE1hdGgucmFuZG9tKCkpO1xuICAgICAgc3RhckFycltpXS5wb3NpdGlvbi54ICs9IHN0YXJBcnJbaV0uYm91bmRzLndpZHRoIC8gNTAwO1xuICAgICAgaWYgKHN0YXJBcnJbaV0uYm91bmRzLmxlZnQgPiB2aWV3LnNpemUud2lkdGgpIHtcbiAgICAgICAgc3RhckFycltpXS5wb3NpdGlvbi54ID0gLXN0YXJBcnJbaV0uYm91bmRzLndpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vcHJvamVjdCByZWZlcnMgdGhlIHdvcmsgZG9uZSBvbiB0aGUgY2FudmFzICBcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHByb2plY3QnLCBwcm9qZWN0KTtcbiAgc29ja2V0LmVtaXQoJ3NlbmR0aGVOaWdodCcsIHByb2plY3QpO1xuICAvLyBleHBvcnRpbmcgZnVuY3Rpb25zIHRvIHVzZSBpbiBzZXJ2ZXIvYXBwL2luZGV4LmpzXG4gIC8vIG1vZHVsZS5leHBvcnRzID0gcHJvZ3Jlc3NfZXh0ZXJuYWxfcGF0aDtcbn0pOyIsImFwcC5mYWN0b3J5KCdEcmF3aW5nRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuICByZXR1cm4ge1xuICAgIGxvYWRDYW52YXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvXCIpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAvaG9tZS9ob21lLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInXG4gICAgfSk7XG59KTsiLCJhcHAuZGlyZWN0aXZlKFwibmF2YmFyXCIsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6IFwiRVwiLFxuXHRcdHRlbXBsYXRlVXJsOiBcIi9hcHAvbmF2YmFyL25hdmJhci5odG1sXCJcblx0fTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==