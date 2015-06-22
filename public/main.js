'use strict';

var app = angular.module('Meaniscule', ['ui.router', 'firebase']);

app.config(function ($urlRouterProvider, $locationProvider) {
   // This turns off hashbang urls (/#about) and changes it to something normal (/about)
   $locationProvider.html5Mode(true);
   // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
   $urlRouterProvider.otherwise('/');
});
"use strict";

app.directive("navbar", function () {
	return {
		restrict: "E",
		templateUrl: "/app/navbar/navbar.html"
	};
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

  // Drawing on the night sky
  var tool = new Tool();

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
      starArr[i].position.x += starArr[i].bounds.width / 200;
      if (starArr[i].bounds.left > view.size.width) {
        starArr[i].position.x = -starArr[i].bounds.width;
      }
    }
  };

  // var blackSquare = Path.Rectangle(new Point(0,0), new Size(view.size._width,view.size._height));
  // blackSquare.fillColor = 'yellow';
  // blackSquare.opacity = 0.85;
  // blackSquare = new Layer();

  // //creating new tool to clear the night sky or "erase" the blackCover on a path
  // var tool2 = new Tool();

  // var stroke2;
  // var path_to_send2 = {};

  // // project.layers[1].insertChild(0, stroke2);
  // tool2.onMouseDown = function (event) {
  //   stroke2 = new Path();
  //   stroke2.fillColor = 'green'; //the color does not affect the functionality
  //   stroke2.opacity = 1;
  //   stroke2.strokeWidth = 20;
  //   // stroke2.blendMode = 'destination-out'; //conflicts with stroke2.fillColor
  //   stroke2.add(event.point);
  // // //defining what to send via sockets
  //   path_to_send2 = {
  //     color: stroke2.fillColor,
  //     start: event.point,
  //     stroke2: []
  //   }
  // }

  // tool2.onMouseDrag = function (event) {
  //   var step = event.delta.divide(2)
  //   step.angle += 90;

  //   var top = event.middlePoint.add(step);
  //   var bottom = event.middlePoint.subtract(step);

  //   stroke2.add(top);
  //   stroke2.insert(0, bottom);
  //   stroke2.smooth();

  //   path_to_send2.stroke2.push({
  //     top: top,
  //     bottom: bottom
  //   });

  //   //emitting my drawing
  //   socket.emit('clearingTheSky', JSON.stringify(path_to_send2));
  // }

  // tool2.onMouseUp = function (event) {
  //   stroke2.add(event.point);
  //   stroke2.closed = true;
  //   stroke2.smooth();
  // }

  // socket.on('friendsSendingtheNight', function(data) {
  //     console.log('friendsSendingtheNight', JSON.parse(data));
  // });

  //project refers the work done on the canvas
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm5hdmJhci9uYXZiYXIuZGlyZWN0aXZlLmpzIiwiaG9tZS9ob21lLmNvbnRyb2xsZXIuanMiLCJob21lL2hvbWUuZmFjdG9yeS5qcyIsImhvbWUvaG9tZS5zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRTs7QUFFekQsb0JBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQyxxQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUNQSCxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxZQUFVO0FBQ2pDLFFBQU87QUFDTixVQUFRLEVBQUUsR0FBRztBQUNiLGFBQVcsRUFBRSx5QkFBeUI7RUFDdEMsQ0FBQztDQUNGLENBQUMsQ0FBQzs7O0FDTEgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDdkQsTUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDbEIsV0FBUyxRQUFRLEdBQUk7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixTQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RCLFNBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekIsQ0FBQztBQUNGLFVBQVEsRUFBRSxDQUFDOzs7QUFHWCxNQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUV0QixNQUFJLE1BQU0sQ0FBQztBQUNYLE1BQUksWUFBWSxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIs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QUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN2RCxVQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzVDLGVBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7T0FDbEQ7S0FDRjtHQUNGLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZERCxRQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0NBR3RDLENBQUMsQ0FBQzs7O0FDMU1ILEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDN0MsU0FBTztBQUNMLGNBQVUsRUFBRSxzQkFBWTtBQUN0QixhQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQ3BCLElBQUksQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUN4QixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0o7R0FDRixDQUFBO0NBQ0YsQ0FBQyxDQUFDOzs7QUNUSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFO0FBQ2pDLGtCQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN6QixXQUFHLEVBQUUsR0FBRztBQUNSLG1CQUFXLEVBQUUscUJBQXFCO0FBQ2xDLGtCQUFVLEVBQUUsZ0JBQWdCO0tBQy9CLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNZWFuaXNjdWxlJywgWyd1aS5yb3V0ZXInLCAnZmlyZWJhc2UnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiYXBwLmRpcmVjdGl2ZShcIm5hdmJhclwiLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiBcIkVcIixcblx0XHR0ZW1wbGF0ZVVybDogXCIvYXBwL25hdmJhci9uYXZiYXIuaHRtbFwiXG5cdH07XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4gIHZhciBzb2NrZXQgPSBpbygpO1xuICBmdW5jdGlvbiBpbml0aWF0ZSAoKSB7IFxuICAgIGNvbnNvbGUubG9nKCdpbml0aWF0ZWQhJyk7XG4gICAgcGFwZXIuaW5zdGFsbCh3aW5kb3cpO1xuICAgIHBhcGVyLnNldHVwKFwibXlDYW52YXNcIik7XG4gIH07XG4gIGluaXRpYXRlKCk7XG5cbiAgLy8gRHJhd2luZyBvbiB0aGUgbmlnaHQgc2t5XG4gIHZhciB0b29sID0gbmV3IFRvb2woKTtcblxuICB2YXIgc3Ryb2tlO1xuICB2YXIgcGF0aF90b19zZW5kID0ge307XG5cbiAgdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZSA9IG5ldyBQYXRoKCk7XG4gICAgc3Ryb2tlLmZpbGxDb2xvciA9IHtcbiAgICAgIGh1ZTogTWF0aC5yYW5kb20oKSAqIDM2MCxcbiAgICAgIHNhdHVyYXRpb246IDEsXG4gICAgICBicmlnaHRuZXNzOiAxXG4gICAgfTtcbiAgICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcblxuICAvL2RlZmluaW5nIHdoYXQgdG8gc2VuZCB2aWEgc29ja2V0c1xuICAgIHBhdGhfdG9fc2VuZCA9IHtcbiAgICAgIGNvbG9yOiBzdHJva2UuZmlsbENvbG9yLFxuICAgICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAgICAgc3Ryb2tlOiBbXVxuICAgIH07XG4gIH07XG5cbiAgdG9vbC5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBzdGVwID0gZXZlbnQuZGVsdGEuZGl2aWRlKDIpXG4gICAgc3RlcC5hbmdsZSArPSA5MDtcblxuICAgIHZhciB0b3AgPSBldmVudC5taWRkbGVQb2ludC5hZGQoc3RlcCk7XG4gICAgdmFyIGJvdHRvbSA9IGV2ZW50Lm1pZGRsZVBvaW50LnN1YnRyYWN0KHN0ZXApO1xuXG4gICAgc3Ryb2tlLmFkZCh0b3ApO1xuICAgIHN0cm9rZS5pbnNlcnQoMCwgYm90dG9tKTtcbiAgICBzdHJva2Uuc21vb3RoKCk7XG5cbiAgICBwYXRoX3RvX3NlbmQuc3Ryb2tlLnB1c2goe1xuICAgICAgdG9wOiB0b3AsXG4gICAgICBib3R0b206IGJvdHRvbVxuICAgIH0pO1xuXG4gICAgLy9lbWl0dGluZyBteSBkcmF3aW5nXG4gICAgc29ja2V0LmVtaXQoJ21lRHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHBhdGhfdG9fc2VuZCkpO1xuICB9XG5cbiAgdG9vbC5vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBzdHJva2UuYWRkKGV2ZW50LnBvaW50KTtcbiAgICBzdHJva2UuY2xvc2VkID0gdHJ1ZTtcbiAgICBzdHJva2Uuc21vb3RoKCk7XG4gIH1cblxuICAvLyBXaGVuIHNvbWVvbmUgZWxzZSBzdGFydHMgZHJhd2luZ1xuICBzb2NrZXQub24oJ2ZyaWVuZHNEcmF3aW5nJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgY29uc29sZS5sb2coJ2ZyaWVuZHNEcmF3aW5nJywgSlNPTi5wYXJzZShkYXRhKSk7XG4gIH0pO1xuXG5cbiAgLy9yZWZlcmVuY2luZyBodHRwczovL2dpdGh1Yi5jb20vYnlyaWNoYXJkcG93ZWxsL2RyYXcvYmxvYi9tYXN0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NhbnZhcy5qc1xuICAvL2ZvciBkcmF3aW5nIGEgcGF0aCBpbiByZWFsIHRpbWVcblxuICAvLyB2YXIgcGF0aCA9IHt9XG4gIC8vIHZhciBwcm9ncmVzc19leHRlcm5hbF9wYXRoID0gZnVuY3Rpb24ocG9pbnRzKSB7XG5cbiAgLy8gICAvL2lmIHRoZXJlIGlzIGN1cnJlbnRseSBubyBwYXRoLCBzdGFydCB0aGUgcGF0aFxuICAvLyAgIGlmKCFwYXRoKSB7XG4gIC8vICAgICBleHRlcm5hbF9wYXRocyA9IG5ldyBQYXRoKCk7XG4gIC8vICAgICBwYXRoID0gZXh0ZXJuYWxfcGF0aHM7XG5cbiAgLy8gICAvL3N0YXJ0aW5nIHRoZSBwYXRoXG4gIC8vICAgICB2YXIgc3RhcnRfcG9pbnQgPSBuZXcgUG9pbnQocG9pbnRzLnN0YXJ0LngsIHBvaW50cy5zdGFydC55KTtcbiAgLy8gICAgIHBhdGguZmlsbENvbG9yID0ge1xuICAvLyAgICAgICBodWU6IE1hdGgucmFuZG9tKCkgKiAzNjAsXG4gIC8vICAgICAgIHNhdHVyYXRpb246IDEsXG4gIC8vICAgICAgIGJyaWdodG5lc3M6IDFcbiAgLy8gICAgIH07XG4gIC8vICAgICBwYXRoLmFkZChzdGFydF9wb2ludCk7ICAgICAgXG4gIC8vICAgfVxuXG4gIC8vICAgdmFyIHBhdGhzID0gcG9pbnRzLnBhdGg7XG5cbiAgLy8gICBmb3IodmFyIGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgIHBhdGguYWRkKHBhdGhzW2ldLnRvcCk7XG4gIC8vICAgICBwYXRoLmluc2VydCgwLCBwYXRoc1tpXS5ib3R0b20pO1xuICAvLyAgIH1cblxuICAvLyAgIHBhdGguc21vb3RoKCk7XG4gIC8vICAgdmlldy5kcmF3KCk7XG4gIC8vIH1cblxuICAvL3JlZmVyZW5jaW5nIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyF0b3BpYy9wYXBlcmpzL2NtUUZRTlRWQUJnXG4gIC8vdmlldy51cGRhdGUgY2FsbGVkIGluIHNvY2tldCBsaXN0ZW5lclxuICAvL21pZ2h0IGNvbmZsaWN0IHdpdGggdGhlIHByb2dyZXNzX2V4dGVybmFsX3BhdGggZnJvbSBhYm92ZVxuXG5cbiAgLy9QdXR0aW5nIHN0YXJzIG9uIHRoZSBuaWdodCBza3lcbiAgdmFyIGNlbnRlciA9IHZpZXcuY2VudGVyO1xuICB2YXIgcG9pbnRzID0gNTtcbiAgdmFyIHJhZGl1czEgPSA1O1xuICB2YXIgcmFkaXVzMiA9IDEwO1xuICB2YXIgc3RhciA9IG5ldyBQYXRoLlN0YXIoY2VudGVyLCBwb2ludHMsIHJhZGl1czEsIHJhZGl1czIpO1xuICBcbiAgc3Rhci5zdHlsZSA9IHtcbiAgICBmaWxsQ29sb3I6ICd5ZWxsb3cnXG4gIH1cblxuICB2YXIgc3RhckFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgdmFyIHN0YXJDb3B5ID0gc3Rhci5jbG9uZSgpO1xuICAgIHZhciByYW5kb21Qb3NpdGlvbiA9IFBvaW50LnJhbmRvbSgpO1xuICAgIHJhbmRvbVBvc2l0aW9uLnggPSByYW5kb21Qb3NpdGlvbi54ICogdmlldy5zaXplLl93aWR0aDtcbiAgICByYW5kb21Qb3NpdGlvbi55ID0gcmFuZG9tUG9zaXRpb24ueSAqIHZpZXcuc2l6ZS5faGVpZ2h0O1xuICAgIHN0YXJDb3B5LnBvc2l0aW9uID0gcmFuZG9tUG9zaXRpb247XG4gICAgc3RhckNvcHkucm90YXRlKE1hdGgucmFuZG9tKCkgKiAyMCk7XG4gICAgc3RhckNvcHkuc2NhbGUoMC4yNSArIE1hdGgucmFuZG9tKCkgKiAwLjc1KTtcbiAgICBzdGFyQ29weS5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm9wYWNpdHkgPSBNYXRoLnJhbmRvbSgpO1xuICAgIH1cbiAgICBzdGFyQXJyLnB1c2goc3RhckNvcHkpO1xuICB9XG5cbiAgc3Rhci5yZW1vdmUoKTtcblxuICB2aWV3Lm9uRnJhbWUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgc3RhckFyci5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhckFycltpXS5maWxsQ29sb3IuaHVlICs9ICAoMSAtIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgKiAyKSAqIChNYXRoLnJhbmRvbSgpICogNSk7XG4gICAgICBzdGFyQXJyW2ldLnJvdGF0ZShNYXRoLnJhbmRvbSgpKTtcbiAgICAgIHN0YXJBcnJbaV0ucG9zaXRpb24ueCArPSBzdGFyQXJyW2ldLmJvdW5kcy53aWR0aCAvIDIwMDtcbiAgICAgIGlmIChzdGFyQXJyW2ldLmJvdW5kcy5sZWZ0ID4gdmlldy5zaXplLndpZHRoKSB7XG4gICAgICAgIHN0YXJBcnJbaV0ucG9zaXRpb24ueCA9IC1zdGFyQXJyW2ldLmJvdW5kcy53aWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8vIHZhciBibGFja1NxdWFyZSA9IFBhdGguUmVjdGFuZ2xlKG5ldyBQb2ludCgwLDApLCBuZXcgU2l6ZSh2aWV3LnNpemUuX3dpZHRoLHZpZXcuc2l6ZS5faGVpZ2h0KSk7XG4gIC8vIGJsYWNrU3F1YXJlLmZpbGxDb2xvciA9ICd5ZWxsb3cnO1xuICAvLyBibGFja1NxdWFyZS5vcGFjaXR5ID0gMC44NTtcbiAgLy8gYmxhY2tTcXVhcmUgPSBuZXcgTGF5ZXIoKTtcblxuICAvLyAvL2NyZWF0aW5nIG5ldyB0b29sIHRvIGNsZWFyIHRoZSBuaWdodCBza3kgb3IgXCJlcmFzZVwiIHRoZSBibGFja0NvdmVyIG9uIGEgcGF0aFxuICAvLyB2YXIgdG9vbDIgPSBuZXcgVG9vbCgpO1xuXG4gIC8vIHZhciBzdHJva2UyO1xuICAvLyB2YXIgcGF0aF90b19zZW5kMiA9IHt9O1xuXG4gIC8vIC8vIHByb2plY3QubGF5ZXJzWzFdLmluc2VydENoaWxkKDAsIHN0cm9rZTIpO1xuICAvLyB0b29sMi5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyAgIHN0cm9rZTIgPSBuZXcgUGF0aCgpO1xuICAvLyAgIHN0cm9rZTIuZmlsbENvbG9yID0gJ2dyZWVuJzsgLy90aGUgY29sb3IgZG9lcyBub3QgYWZmZWN0IHRoZSBmdW5jdGlvbmFsaXR5XG4gIC8vICAgc3Ryb2tlMi5vcGFjaXR5ID0gMTtcbiAgLy8gICBzdHJva2UyLnN0cm9rZVdpZHRoID0gMjA7XG4gIC8vICAgLy8gc3Ryb2tlMi5ibGVuZE1vZGUgPSAnZGVzdGluYXRpb24tb3V0JzsgLy9jb25mbGljdHMgd2l0aCBzdHJva2UyLmZpbGxDb2xvclxuICAvLyAgIHN0cm9rZTIuYWRkKGV2ZW50LnBvaW50KTtcbiAgLy8gLy8gLy9kZWZpbmluZyB3aGF0IHRvIHNlbmQgdmlhIHNvY2tldHNcbiAgLy8gICBwYXRoX3RvX3NlbmQyID0ge1xuICAvLyAgICAgY29sb3I6IHN0cm9rZTIuZmlsbENvbG9yLFxuICAvLyAgICAgc3RhcnQ6IGV2ZW50LnBvaW50LFxuICAvLyAgICAgc3Ryb2tlMjogW11cbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyB0b29sMi5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyAgIHZhciBzdGVwID0gZXZlbnQuZGVsdGEuZGl2aWRlKDIpXG4gIC8vICAgc3RlcC5hbmdsZSArPSA5MDtcblxuICAvLyAgIHZhciB0b3AgPSBldmVudC5taWRkbGVQb2ludC5hZGQoc3RlcCk7XG4gIC8vICAgdmFyIGJvdHRvbSA9IGV2ZW50Lm1pZGRsZVBvaW50LnN1YnRyYWN0KHN0ZXApO1xuXG4gIC8vICAgc3Ryb2tlMi5hZGQodG9wKTtcbiAgLy8gICBzdHJva2UyLmluc2VydCgwLCBib3R0b20pO1xuICAvLyAgIHN0cm9rZTIuc21vb3RoKCk7XG5cbiAgLy8gICBwYXRoX3RvX3NlbmQyLnN0cm9rZTIucHVzaCh7XG4gIC8vICAgICB0b3A6IHRvcCxcbiAgLy8gICAgIGJvdHRvbTogYm90dG9tXG4gIC8vICAgfSk7XG5cbiAgLy8gICAvL2VtaXR0aW5nIG15IGRyYXdpbmdcbiAgLy8gICBzb2NrZXQuZW1pdCgnY2xlYXJpbmdUaGVTa3knLCBKU09OLnN0cmluZ2lmeShwYXRoX3RvX3NlbmQyKSk7XG4gIC8vIH1cblxuICAvLyB0b29sMi5vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gICBzdHJva2UyLmFkZChldmVudC5wb2ludCk7XG4gIC8vICAgc3Ryb2tlMi5jbG9zZWQgPSB0cnVlO1xuICAvLyAgIHN0cm9rZTIuc21vb3RoKCk7XG4gIC8vIH1cbiAgXG4gIC8vIHNvY2tldC5vbignZnJpZW5kc1NlbmRpbmd0aGVOaWdodCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKCdmcmllbmRzU2VuZGluZ3RoZU5pZ2h0JywgSlNPTi5wYXJzZShkYXRhKSk7XG4gIC8vIH0pO1xuXG4gIC8vcHJvamVjdCByZWZlcnMgdGhlIHdvcmsgZG9uZSBvbiB0aGUgY2FudmFzXG4gIHNvY2tldC5lbWl0KCdzZW5kdGhlTmlnaHQnLCBwcm9qZWN0KTtcbiAgLy8gZXhwb3J0aW5nIGZ1bmN0aW9ucyB0byB1c2UgaW4gc2VydmVyL2FwcC9pbmRleC5qc1xuICAvLyBtb2R1bGUuZXhwb3J0cyA9IHByb2dyZXNzX2V4dGVybmFsX3BhdGg7XG59KTtcbiIsImFwcC5mYWN0b3J5KCdEcmF3aW5nRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuICByZXR1cm4ge1xuICAgIGxvYWRDYW52YXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvXCIpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHAvaG9tZS9ob21lLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInXG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=