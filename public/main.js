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
  // var path_to_send = {};

  tool.onMouseDown = function (event) {
    stroke = new Path();
    stroke.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    };
    stroke.add(event.point);

    //defining what to send via sockets
    // path_to_send = {
    //   color: stroke.fillColor,
    //   start: event.point,
    //   stroke: []
    // }
  };

  tool.onMouseDrag = function (event) {
    var step = event.delta.divide(2);
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke.add(top);
    stroke.insert(0, bottom);
    stroke.smooth();

    // path_to_send.stroke.push({
    //   top: top,
    //   bottom: bottom
    // });

    //emitting my drawing
    // socket.emit('meDrawing', JSON.stringify(path_to_send));
  };

  tool.onMouseUp = function (event) {
    stroke.add(event.point);
    stroke.closed = true;
    stroke.smooth();
  };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRTs7QUFFekQsb0JBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQyxxQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUNQSCxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUN2RCxNQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQzs7QUFFbEIsV0FBUyxRQUFRLEdBQUk7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixTQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RCLFNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekIsQ0FBQzs7QUFFRixVQUFRLEVBQUUsQ0FBQzs7O0FBR1gsTUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN0QixNQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsTUFBSSxNQUFNLENBQUM7OztBQUdYLE1BQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDbEMsVUFBTSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDcEIs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QUFDdEIsYUFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNwQixJQUFJLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFDeEIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDO09BQ3RCLENBQUMsQ0FBQztLQUNKO0dBQ0YsQ0FBQTtDQUNGLENBQUMsQ0FBQzs7O0FDVEgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLGNBQWMsRUFBRTtBQUNqQyxrQkFBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDekIsV0FBRyxFQUFFLEdBQUc7QUFDUixtQkFBVyxFQUFFLHFCQUFxQjtBQUNsQyxrQkFBVSxFQUFFLGdCQUFnQjtLQUMvQixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7OztBQ05ILEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFlBQVU7QUFDakMsUUFBTztBQUNOLFVBQVEsRUFBRSxHQUFHO0FBQ2IsYUFBVyxFQUFFLHlCQUF5QjtFQUN0QyxDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ01lYW5pc2N1bGUnLCBbJ3VpLnJvdXRlcicsICdmaXJlYmFzZSddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4gIHZhciBzb2NrZXQgPSBpbygpO1xuICBcbiAgZnVuY3Rpb24gaW5pdGlhdGUgKCkgeyBcbiAgICBjb25zb2xlLmxvZygnaW5pdGlhdGVkIScpO1xuICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbiAgICBwYXBlci5zZXR1cChcIm15Q2FudmFzXCIpO1xuICB9O1xuXG4gIGluaXRpYXRlKCk7XG5cbiAgLy9EcmF3aW5nIG9uIHRoZSBuaWdodCBza3lcbiAgdmFyIHRvb2wgPSBuZXcgVG9vbCgpO1xuICB0b29sLm1pbkRpc3RhbmNlID0gMTA7XG4gIHRvb2wubWF4RGlzdGFuY2UgPSA0NTtcblxuICB2YXIgc3Ryb2tlO1xuICAvLyB2YXIgcGF0aF90b19zZW5kID0ge307XG5cbiAgdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZSA9IG5ldyBQYXRoKCk7XG4gICAgc3Ryb2tlLmZpbGxDb2xvciA9IHtcbiAgICAgIGh1ZTogTWF0aC5yYW5kb20oKSAqIDM2MCxcbiAgICAgIHNhdHVyYXRpb246IDEsXG4gICAgICBicmlnaHRuZXNzOiAxXG4gICAgfTtcbiAgICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcblxuICAvL2RlZmluaW5nIHdoYXQgdG8gc2VuZCB2aWEgc29ja2V0c1xuICAgIC8vIHBhdGhfdG9fc2VuZCA9IHtcbiAgICAvLyAgIGNvbG9yOiBzdHJva2UuZmlsbENvbG9yLFxuICAgIC8vICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAgIC8vICAgc3Ryb2tlOiBbXVxuICAgIC8vIH1cbiAgfVxuXG4gIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc3RlcCA9IGV2ZW50LmRlbHRhLmRpdmlkZSgyKVxuICAgIHN0ZXAuYW5nbGUgKz0gOTA7XG5cbiAgICB2YXIgdG9wID0gZXZlbnQubWlkZGxlUG9pbnQuYWRkKHN0ZXApO1xuICAgIHZhciBib3R0b20gPSBldmVudC5taWRkbGVQb2ludC5zdWJ0cmFjdChzdGVwKTtcblxuICAgIHN0cm9rZS5hZGQodG9wKTtcbiAgICBzdHJva2UuaW5zZXJ0KDAsIGJvdHRvbSk7XG4gICAgc3Ryb2tlLnNtb290aCgpO1xuXG4gICAgLy8gcGF0aF90b19zZW5kLnN0cm9rZS5wdXNoKHtcbiAgICAvLyAgIHRvcDogdG9wLFxuICAgIC8vICAgYm90dG9tOiBib3R0b21cbiAgICAvLyB9KTtcblxuICAvL2VtaXR0aW5nIG15IGRyYXdpbmdcbiAgICAvLyBzb2NrZXQuZW1pdCgnbWVEcmF3aW5nJywgSlNPTi5zdHJpbmdpZnkocGF0aF90b19zZW5kKSk7XG4gIH1cblxuXG4gIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgc3Ryb2tlLmFkZChldmVudC5wb2ludCk7XG4gICAgc3Ryb2tlLmNsb3NlZCA9IHRydWU7XG4gICAgc3Ryb2tlLnNtb290aCgpO1xuICB9XG5cblxuICAvL3JlZmVyZW5jaW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9ieXJpY2hhcmRwb3dlbGwvZHJhdy9ibG9iL21hc3Rlci9wdWJsaWMvamF2YXNjcmlwdHMvY2FudmFzLmpzXG4gIC8vZm9yIGRyYXdpbmcgYSBwYXRoIGluIHJlYWwgdGltZVxuXG4gIC8vIHZhciBwYXRoID0ge31cbiAgLy8gdmFyIHByb2dyZXNzX2V4dGVybmFsX3BhdGggPSBmdW5jdGlvbihwb2ludHMpIHtcblxuICAvLyAgIC8vaWYgdGhlcmUgaXMgY3VycmVudGx5IG5vIHBhdGgsIHN0YXJ0IHRoZSBwYXRoXG4gIC8vICAgaWYoIXBhdGgpIHtcbiAgLy8gICAgIGV4dGVybmFsX3BhdGhzID0gbmV3IFBhdGgoKTtcbiAgLy8gICAgIHBhdGggPSBleHRlcm5hbF9wYXRocztcblxuICAvLyAgIC8vc3RhcnRpbmcgdGhlIHBhdGhcbiAgLy8gICAgIHZhciBzdGFydF9wb2ludCA9IG5ldyBQb2ludChwb2ludHMuc3RhcnQueCwgcG9pbnRzLnN0YXJ0LnkpO1xuICAvLyAgICAgcGF0aC5maWxsQ29sb3IgPSB7XG4gIC8vICAgICAgIGh1ZTogTWF0aC5yYW5kb20oKSAqIDM2MCxcbiAgLy8gICAgICAgc2F0dXJhdGlvbjogMSxcbiAgLy8gICAgICAgYnJpZ2h0bmVzczogMVxuICAvLyAgICAgfTtcbiAgLy8gICAgIHBhdGguYWRkKHN0YXJ0X3BvaW50KTsgICAgICBcbiAgLy8gICB9XG5cbiAgLy8gICB2YXIgcGF0aHMgPSBwb2ludHMucGF0aDtcblxuICAvLyAgIGZvcih2YXIgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuICAvLyAgICAgcGF0aC5hZGQocGF0aHNbaV0udG9wKTtcbiAgLy8gICAgIHBhdGguaW5zZXJ0KDAsIHBhdGhzW2ldLmJvdHRvbSk7XG4gIC8vICAgfVxuXG4gIC8vICAgcGF0aC5zbW9vdGgoKTtcbiAgLy8gICB2aWV3LmRyYXcoKTtcbiAgLy8gfVxuXG4gIC8vcmVmZXJlbmNpbmcgaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIXRvcGljL3BhcGVyanMvY21RRlFOVFZBQmdcbiAgLy92aWV3LnVwZGF0ZSBjYWxsZWQgaW4gc29ja2V0IGxpc3RlbmVyXG4gIC8vbWlnaHQgY29uZmxpY3Qgd2l0aCB0aGUgcHJvZ3Jlc3NfZXh0ZXJuYWxfcGF0aCBmcm9tIGFib3ZlXG5cbiAgLy8gc29ja2V0Lm9uKCdmcmllbmRzRHJhd2luZycsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy8gICBKU09OLnBhcnNlKGRhdGEpO1xuICAvLyAgIHZpZXcudXBkYXRlKCk7XG4gIC8vIH0pO1xuXG5cblxuXG4gIC8vUHV0dGluZyBzdGFycyBvbiB0aGUgbmlnaHQgc2t5XG4gIHZhciBjZW50ZXIgPSB2aWV3LmNlbnRlcjtcbiAgdmFyIHBvaW50cyA9IDU7XG4gIHZhciByYWRpdXMxID0gNTtcbiAgdmFyIHJhZGl1czIgPSAxMDtcbiAgdmFyIHN0YXIgPSBuZXcgUGF0aC5TdGFyKGNlbnRlciwgcG9pbnRzLCByYWRpdXMxLCByYWRpdXMyKTtcbiAgXG4gIHN0YXIuc3R5bGUgPSB7XG4gICAgZmlsbENvbG9yOiAneWVsbG93J1xuICB9XG5cbiAgdmFyIHN0YXJBcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgIHZhciBzdGFyQ29weSA9IHN0YXIuY2xvbmUoKTtcbiAgICB2YXIgcmFuZG9tUG9zaXRpb24gPSBQb2ludC5yYW5kb20oKTtcbiAgICByYW5kb21Qb3NpdGlvbi54ID0gcmFuZG9tUG9zaXRpb24ueCAqIHZpZXcuc2l6ZS5fd2lkdGg7XG4gICAgcmFuZG9tUG9zaXRpb24ueSA9IHJhbmRvbVBvc2l0aW9uLnkgKiB2aWV3LnNpemUuX2hlaWdodDtcbiAgICBzdGFyQ29weS5wb3NpdGlvbiA9IHJhbmRvbVBvc2l0aW9uO1xuICAgIHN0YXJDb3B5LnJvdGF0ZShNYXRoLnJhbmRvbSgpICogMjApO1xuICAgIHN0YXJDb3B5LnNjYWxlKDAuMjUgKyBNYXRoLnJhbmRvbSgpICogMC43NSk7XG4gICAgc3RhckNvcHkub25Nb3VzZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5vcGFjaXR5ID0gTWF0aC5yYW5kb20oKTtcbiAgICB9XG4gICAgc3RhckFyci5wdXNoKHN0YXJDb3B5KTtcbiAgfVxuXG4gIHN0YXIucmVtb3ZlKCk7XG5cbiAgdmlldy5vbkZyYW1lID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHN0YXJBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJBcnJbaV0uZmlsbENvbG9yLmh1ZSArPSAgKDEgLSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpICogMikgKiAoTWF0aC5yYW5kb20oKSAqIDUpO1xuICAgICAgc3RhckFycltpXS5yb3RhdGUoTWF0aC5yYW5kb20oKSk7XG4gICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggKz0gc3RhckFycltpXS5ib3VuZHMud2lkdGggLyA1MDA7XG4gICAgICBpZiAoc3RhckFycltpXS5ib3VuZHMubGVmdCA+IHZpZXcuc2l6ZS53aWR0aCkge1xuICAgICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggPSAtc3RhckFycltpXS5ib3VuZHMud2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy9wcm9qZWN0IHJlZmVycyB0aGUgd29yayBkb25lIG9uIHRoZSBjYW52YXMgIFxuICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgcHJvamVjdCcsIHByb2plY3QpO1xuICBzb2NrZXQuZW1pdCgnc2VuZHRoZU5pZ2h0JywgcHJvamVjdCk7XG4gIC8vIGV4cG9ydGluZyBmdW5jdGlvbnMgdG8gdXNlIGluIHNlcnZlci9hcHAvaW5kZXguanNcbiAgLy8gbW9kdWxlLmV4cG9ydHMgPSBwcm9ncmVzc19leHRlcm5hbF9wYXRoO1xuXG59KTsiLCJhcHAuZmFjdG9yeSgnRHJhd2luZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgcmV0dXJuIHtcbiAgICBsb2FkQ2FudmFzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL1wiKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgIH0pO1xufSk7IiwiYXBwLmRpcmVjdGl2ZShcIm5hdmJhclwiLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiBcIkVcIixcblx0XHR0ZW1wbGF0ZVVybDogXCIvYXBwL25hdmJhci9uYXZiYXIuaHRtbFwiXG5cdH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=