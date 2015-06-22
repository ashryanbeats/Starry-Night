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
  // var tool = new Tool();

  // var stroke;
  // var path_to_send = {};

  // tool.onMouseDown = function (event) {
  //   stroke = new Path();
  //   stroke.fillColor = {
  //     hue: Math.random() * 360,
  //     saturation: 1,
  //     brightness: 1
  //   };
  //   stroke.add(event.point);

  // //defining what to send via sockets
  //   path_to_send = {
  //     color: stroke.fillColor,
  //     start: event.point,
  //     stroke: []
  //   }
  // }

  // tool.onMouseDrag = function (event) {
  //   var step = event.delta.divide(2)
  //   step.angle += 90;

  //   var top = event.middlePoint.add(step);
  //   var bottom = event.middlePoint.subtract(step);

  //   stroke.add(top);
  //   stroke.insert(0, bottom);
  //   stroke.smooth();

  //   path_to_send.stroke.push({
  //     top: top,
  //     bottom: bottom
  //   });

  //   //emitting my drawing
  //   socket.emit('meDrawing', JSON.stringify(path_to_send));
  // }

  // tool.onMouseUp = function (event) {
  //   stroke.add(event.point);
  //   stroke.closed = true;
  //   stroke.smooth();
  // }

  // // When someone else starts drawing
  // socket.on('friendsDrawing', function(data) {
  //     console.log('friendsDrawing',JSON.parse(data));
  // });

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

  var blackSquare = Path.Rectangle(new Point(0, 0), new Size(view.size._width, view.size._height));
  blackSquare.fillColor = 'black';
  blackSquare.opacity = 0.85;
  //#1. existing starry sky is kept where it doesn't overlap the blackCover
  // blackSquare.blendMode = 'destination-out';

  var blackCover = new Layer({
    children: blackSquare
  });

  //#2. creating new tool to clear the night sky or "erase" the blackCover on a path
  var tool2 = new Tool();

  var stroke2;
  var path_to_send2 = {};

  tool2.onMouseDown = function (event) {
    stroke2 = new Path();
    stroke2.fillColor = {
      hue: Math.random() * 360
    };
    stroke2.strokeWidth = 20;
    stroke2.blendMode = 'destination-out';
    stroke2.add(event.point);

    // //defining what to send via sockets
    path_to_send2 = {
      color: stroke2.fillColor,
      start: event.point,
      stroke2: []
    };
  };

  tool2.onMouseDrag = function (event) {
    var step = event.delta.divide(2);
    step.angle += 90;

    var top = event.middlePoint.add(step);
    var bottom = event.middlePoint.subtract(step);

    stroke2.blendMode = 'destination-out';
    stroke2.add(top);
    stroke2.insert(0, bottom);
    stroke2.smooth();

    path_to_send2.stroke2.push({
      top: top,
      bottom: bottom
    });

    //emitting my drawing
    socket.emit('clearingTheSky', JSON.stringify(path_to_send2));
  };

  tool2.onMouseUp = function (event) {
    stroke2.add(event.point);
    stroke2.closed = true;
    stroke2.smooth();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRTs7QUFFekQsb0JBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQyxxQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUNQSCxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUN2RCxNQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQzs7QUFFbEIsV0FBUyxRQUFRLEdBQUk7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixTQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RCLFNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekIsQ0FBQzs7QUFFRixVQUFRLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzR1gsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixNQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZixNQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsTUFBSSxPQUFPLEdBQUcs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QUcsRUFBRSxHQUFHO0FBQ1IsbUJBQVcsRUFBRSxxQkFBcUI7QUFDbEMsa0JBQVUsRUFBRSxnQkFBZ0I7S0FDL0IsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7QUNOSCxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxZQUFVO0FBQ2pDLFFBQU87QUFDTixVQUFRLEVBQUUsR0FBRztBQUNiLGFBQVcsRUFBRSx5QkFBeUI7RUFDdEMsQ0FBQztDQUNGLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNZWFuaXNjdWxlJywgWyd1aS5yb3V0ZXInLCAnZmlyZWJhc2UnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICB2YXIgc29ja2V0ID0gaW8oKTtcbiAgXG4gIGZ1bmN0aW9uIGluaXRpYXRlICgpIHsgXG4gICAgY29uc29sZS5sb2coJ2luaXRpYXRlZCEnKTtcbiAgICBwYXBlci5pbnN0YWxsKHdpbmRvdyk7XG4gICAgcGFwZXIuc2V0dXAoXCJteUNhbnZhc1wiKTtcbiAgfTtcblxuICBpbml0aWF0ZSgpO1xuXG4gIC8vRHJhd2luZyBvbiB0aGUgbmlnaHQgc2t5XG4gIC8vIHZhciB0b29sID0gbmV3IFRvb2woKTtcblxuICAvLyB2YXIgc3Ryb2tlO1xuICAvLyB2YXIgcGF0aF90b19zZW5kID0ge307XG5cbiAgLy8gdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyAgIHN0cm9rZSA9IG5ldyBQYXRoKCk7XG4gIC8vICAgc3Ryb2tlLmZpbGxDb2xvciA9IHtcbiAgLy8gICAgIGh1ZTogTWF0aC5yYW5kb20oKSAqIDM2MCxcbiAgLy8gICAgIHNhdHVyYXRpb246IDEsXG4gIC8vICAgICBicmlnaHRuZXNzOiAxXG4gIC8vICAgfTtcbiAgLy8gICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcblxuICAvLyAvL2RlZmluaW5nIHdoYXQgdG8gc2VuZCB2aWEgc29ja2V0c1xuICAvLyAgIHBhdGhfdG9fc2VuZCA9IHtcbiAgLy8gICAgIGNvbG9yOiBzdHJva2UuZmlsbENvbG9yLFxuICAvLyAgICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAvLyAgICAgc3Ryb2tlOiBbXVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gICB2YXIgc3RlcCA9IGV2ZW50LmRlbHRhLmRpdmlkZSgyKVxuICAvLyAgIHN0ZXAuYW5nbGUgKz0gOTA7XG5cbiAgLy8gICB2YXIgdG9wID0gZXZlbnQubWlkZGxlUG9pbnQuYWRkKHN0ZXApO1xuICAvLyAgIHZhciBib3R0b20gPSBldmVudC5taWRkbGVQb2ludC5zdWJ0cmFjdChzdGVwKTtcblxuICAvLyAgIHN0cm9rZS5hZGQodG9wKTtcbiAgLy8gICBzdHJva2UuaW5zZXJ0KDAsIGJvdHRvbSk7XG4gIC8vICAgc3Ryb2tlLnNtb290aCgpO1xuXG4gIC8vICAgcGF0aF90b19zZW5kLnN0cm9rZS5wdXNoKHtcbiAgLy8gICAgIHRvcDogdG9wLFxuICAvLyAgICAgYm90dG9tOiBib3R0b21cbiAgLy8gICB9KTtcblxuICAvLyAgIC8vZW1pdHRpbmcgbXkgZHJhd2luZ1xuICAvLyAgIHNvY2tldC5lbWl0KCdtZURyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShwYXRoX3RvX3NlbmQpKTtcbiAgLy8gfVxuXG4gIC8vIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vICAgc3Ryb2tlLmFkZChldmVudC5wb2ludCk7XG4gIC8vICAgc3Ryb2tlLmNsb3NlZCA9IHRydWU7XG4gIC8vICAgc3Ryb2tlLnNtb290aCgpO1xuICAvLyB9XG5cbiAgLy8gLy8gV2hlbiBzb21lb25lIGVsc2Ugc3RhcnRzIGRyYXdpbmdcbiAgLy8gc29ja2V0Lm9uKCdmcmllbmRzRHJhd2luZycsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKCdmcmllbmRzRHJhd2luZycsSlNPTi5wYXJzZShkYXRhKSk7XG4gIC8vIH0pO1xuXG5cbiAgLy9yZWZlcmVuY2luZyBodHRwczovL2dpdGh1Yi5jb20vYnlyaWNoYXJkcG93ZWxsL2RyYXcvYmxvYi9tYXN0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NhbnZhcy5qc1xuICAvL2ZvciBkcmF3aW5nIGEgcGF0aCBpbiByZWFsIHRpbWVcblxuICAvLyB2YXIgcGF0aCA9IHt9XG4gIC8vIHZhciBwcm9ncmVzc19leHRlcm5hbF9wYXRoID0gZnVuY3Rpb24ocG9pbnRzKSB7XG5cbiAgLy8gICAvL2lmIHRoZXJlIGlzIGN1cnJlbnRseSBubyBwYXRoLCBzdGFydCB0aGUgcGF0aFxuICAvLyAgIGlmKCFwYXRoKSB7XG4gIC8vICAgICBleHRlcm5hbF9wYXRocyA9IG5ldyBQYXRoKCk7XG4gIC8vICAgICBwYXRoID0gZXh0ZXJuYWxfcGF0aHM7XG5cbiAgLy8gICAvL3N0YXJ0aW5nIHRoZSBwYXRoXG4gIC8vICAgICB2YXIgc3RhcnRfcG9pbnQgPSBuZXcgUG9pbnQocG9pbnRzLnN0YXJ0LngsIHBvaW50cy5zdGFydC55KTtcbiAgLy8gICAgIHBhdGguZmlsbENvbG9yID0ge1xuICAvLyAgICAgICBodWU6IE1hdGgucmFuZG9tKCkgKiAzNjAsXG4gIC8vICAgICAgIHNhdHVyYXRpb246IDEsXG4gIC8vICAgICAgIGJyaWdodG5lc3M6IDFcbiAgLy8gICAgIH07XG4gIC8vICAgICBwYXRoLmFkZChzdGFydF9wb2ludCk7ICAgICAgXG4gIC8vICAgfVxuXG4gIC8vICAgdmFyIHBhdGhzID0gcG9pbnRzLnBhdGg7XG5cbiAgLy8gICBmb3IodmFyIGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgIHBhdGguYWRkKHBhdGhzW2ldLnRvcCk7XG4gIC8vICAgICBwYXRoLmluc2VydCgwLCBwYXRoc1tpXS5ib3R0b20pO1xuICAvLyAgIH1cblxuICAvLyAgIHBhdGguc21vb3RoKCk7XG4gIC8vICAgdmlldy5kcmF3KCk7XG4gIC8vIH1cblxuICAvL3JlZmVyZW5jaW5nIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyF0b3BpYy9wYXBlcmpzL2NtUUZRTlRWQUJnXG4gIC8vdmlldy51cGRhdGUgY2FsbGVkIGluIHNvY2tldCBsaXN0ZW5lclxuICAvL21pZ2h0IGNvbmZsaWN0IHdpdGggdGhlIHByb2dyZXNzX2V4dGVybmFsX3BhdGggZnJvbSBhYm92ZVxuXG4gIC8vIHNvY2tldC5vbignZnJpZW5kc0RyYXdpbmcnLCBmdW5jdGlvbihkYXRhKSB7XG4gIC8vICAgSlNPTi5wYXJzZShkYXRhKTtcbiAgLy8gICB2aWV3LnVwZGF0ZSgpO1xuICAvLyB9KTtcblxuXG5cblxuICAvL1B1dHRpbmcgc3RhcnMgb24gdGhlIG5pZ2h0IHNreVxuICB2YXIgY2VudGVyID0gdmlldy5jZW50ZXI7XG4gIHZhciBwb2ludHMgPSA1O1xuICB2YXIgcmFkaXVzMSA9IDU7XG4gIHZhciByYWRpdXMyID0gMTA7XG4gIHZhciBzdGFyID0gbmV3IFBhdGguU3RhcihjZW50ZXIsIHBvaW50cywgcmFkaXVzMSwgcmFkaXVzMik7XG4gIFxuICBzdGFyLnN0eWxlID0ge1xuICAgIGZpbGxDb2xvcjogJ3llbGxvdydcbiAgfVxuXG4gIHZhciBzdGFyQXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICB2YXIgc3RhckNvcHkgPSBzdGFyLmNsb25lKCk7XG4gICAgdmFyIHJhbmRvbVBvc2l0aW9uID0gUG9pbnQucmFuZG9tKCk7XG4gICAgcmFuZG9tUG9zaXRpb24ueCA9IHJhbmRvbVBvc2l0aW9uLnggKiB2aWV3LnNpemUuX3dpZHRoO1xuICAgIHJhbmRvbVBvc2l0aW9uLnkgPSByYW5kb21Qb3NpdGlvbi55ICogdmlldy5zaXplLl9oZWlnaHQ7XG4gICAgc3RhckNvcHkucG9zaXRpb24gPSByYW5kb21Qb3NpdGlvbjtcbiAgICBzdGFyQ29weS5yb3RhdGUoTWF0aC5yYW5kb20oKSAqIDIwKTtcbiAgICBzdGFyQ29weS5zY2FsZSgwLjI1ICsgTWF0aC5yYW5kb20oKSAqIDAuNzUpO1xuICAgIHN0YXJDb3B5Lm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHRoaXMub3BhY2l0eSA9IE1hdGgucmFuZG9tKCk7XG4gICAgfVxuICAgIHN0YXJBcnIucHVzaChzdGFyQ29weSk7XG4gIH1cblxuICBzdGFyLnJlbW92ZSgpO1xuXG4gIHZpZXcub25GcmFtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzdGFyQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdGFyQXJyW2ldLmZpbGxDb2xvci5odWUgKz0gICgxIC0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSAqIDIpICogKE1hdGgucmFuZG9tKCkgKiA1KTtcbiAgICAgIHN0YXJBcnJbaV0ucm90YXRlKE1hdGgucmFuZG9tKCkpO1xuICAgICAgc3RhckFycltpXS5wb3NpdGlvbi54ICs9IHN0YXJBcnJbaV0uYm91bmRzLndpZHRoIC8gNTAwO1xuICAgICAgaWYgKHN0YXJBcnJbaV0uYm91bmRzLmxlZnQgPiB2aWV3LnNpemUud2lkdGgpIHtcbiAgICAgICAgc3RhckFycltpXS5wb3NpdGlvbi54ID0gLXN0YXJBcnJbaV0uYm91bmRzLndpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdmFyIGJsYWNrU3F1YXJlID0gUGF0aC5SZWN0YW5nbGUobmV3IFBvaW50KDAsMCksIG5ldyBTaXplKHZpZXcuc2l6ZS5fd2lkdGgsdmlldy5zaXplLl9oZWlnaHQpKTtcbiAgYmxhY2tTcXVhcmUuZmlsbENvbG9yID0gJ2JsYWNrJztcbiAgYmxhY2tTcXVhcmUub3BhY2l0eSA9IDAuODU7XG4gIC8vIzEuIGV4aXN0aW5nIHN0YXJyeSBza3kgaXMga2VwdCB3aGVyZSBpdCBkb2Vzbid0IG92ZXJsYXAgdGhlIGJsYWNrQ292ZXJcbiAgLy8gYmxhY2tTcXVhcmUuYmxlbmRNb2RlID0gJ2Rlc3RpbmF0aW9uLW91dCc7XG5cbiAgdmFyIGJsYWNrQ292ZXIgPSBuZXcgTGF5ZXIoe1xuICAgIGNoaWxkcmVuOiBibGFja1NxdWFyZVxuICB9KTtcblxuICAvLyMyLiBjcmVhdGluZyBuZXcgdG9vbCB0byBjbGVhciB0aGUgbmlnaHQgc2t5IG9yIFwiZXJhc2VcIiB0aGUgYmxhY2tDb3ZlciBvbiBhIHBhdGhcbiAgdmFyIHRvb2wyID0gbmV3IFRvb2woKTtcblxuICB2YXIgc3Ryb2tlMjtcbiAgdmFyIHBhdGhfdG9fc2VuZDIgPSB7fTtcblxuICB0b29sMi5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZTIgPSBuZXcgUGF0aCgpO1xuICAgIHN0cm9rZTIuZmlsbENvbG9yID0ge1xuICAgICAgaHVlOiBNYXRoLnJhbmRvbSgpICogMzYwXG4gICAgfTtcbiAgICBzdHJva2UyLnN0cm9rZVdpZHRoID0gMjA7XG4gICAgc3Ryb2tlMi5ibGVuZE1vZGUgPSAnZGVzdGluYXRpb24tb3V0JztcbiAgICBzdHJva2UyLmFkZChldmVudC5wb2ludCk7XG5cbiAgLy8gLy9kZWZpbmluZyB3aGF0IHRvIHNlbmQgdmlhIHNvY2tldHNcbiAgICBwYXRoX3RvX3NlbmQyID0ge1xuICAgICAgY29sb3I6IHN0cm9rZTIuZmlsbENvbG9yLFxuICAgICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAgICAgc3Ryb2tlMjogW11cbiAgICB9XG4gIH1cblxuICB0b29sMi5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBzdGVwID0gZXZlbnQuZGVsdGEuZGl2aWRlKDIpXG4gICAgc3RlcC5hbmdsZSArPSA5MDtcblxuICAgIHZhciB0b3AgPSBldmVudC5taWRkbGVQb2ludC5hZGQoc3RlcCk7XG4gICAgdmFyIGJvdHRvbSA9IGV2ZW50Lm1pZGRsZVBvaW50LnN1YnRyYWN0KHN0ZXApO1xuXG4gICAgc3Ryb2tlMi5ibGVuZE1vZGUgPSAnZGVzdGluYXRpb24tb3V0JztcbiAgICBzdHJva2UyLmFkZCh0b3ApO1xuICAgIHN0cm9rZTIuaW5zZXJ0KDAsIGJvdHRvbSk7XG4gICAgc3Ryb2tlMi5zbW9vdGgoKTtcblxuICAgIHBhdGhfdG9fc2VuZDIuc3Ryb2tlMi5wdXNoKHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgYm90dG9tOiBib3R0b21cbiAgICB9KTtcblxuICAgIC8vZW1pdHRpbmcgbXkgZHJhd2luZ1xuICAgIHNvY2tldC5lbWl0KCdjbGVhcmluZ1RoZVNreScsIEpTT04uc3RyaW5naWZ5KHBhdGhfdG9fc2VuZDIpKTtcbiAgfVxuXG4gIHRvb2wyLm9uTW91c2VVcCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZTIuYWRkKGV2ZW50LnBvaW50KTtcbiAgICBzdHJva2UyLmNsb3NlZCA9IHRydWU7XG4gICAgc3Ryb2tlMi5zbW9vdGgoKTtcbiAgfVxuXG4gIC8vcHJvamVjdCByZWZlcnMgdGhlIHdvcmsgZG9uZSBvbiB0aGUgY2FudmFzICBcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHByb2plY3QnLCBwcm9qZWN0KTtcbiAgc29ja2V0LmVtaXQoJ3NlbmR0aGVOaWdodCcsIHByb2plY3QpO1xuICAvLyBleHBvcnRpbmcgZnVuY3Rpb25zIHRvIHVzZSBpbiBzZXJ2ZXIvYXBwL2luZGV4LmpzXG4gIC8vIG1vZHVsZS5leHBvcnRzID0gcHJvZ3Jlc3NfZXh0ZXJuYWxfcGF0aDtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ0RyYXdpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZENhbnZhczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChcIi9cIilcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICB9KTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJuYXZiYXJcIiwgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogXCJFXCIsXG5cdFx0dGVtcGxhdGVVcmw6IFwiL2FwcC9uYXZiYXIvbmF2YmFyLmh0bWxcIlxuXHR9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9