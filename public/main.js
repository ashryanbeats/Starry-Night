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
    // console.log('this is event.point onMouseDown', event.point);
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
    // console.log('this is event.point onMouseDrag', event.point);
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
    var stroke2 = new Path();
    var friendsDrawing = JSON.parse(data);
    var eachStroke = friendsDrawing.stroke;
    var start_point = new Point(friendsDrawing.start[1], friendsDrawing.start[2]);
    var color = friendsDrawing.color;
    stroke2.fillColor = color;
    stroke2.add(start_point);
    for (var i = 0; i < eachStroke.length; i++) {
      stroke2.add(new Point(eachStroke[i].top[1], eachStroke[i].top[2]));
      stroke2.insert(0, new Point(eachStroke[i].bottom[1], eachStroke[i].bottom[2]));
    }
    stroke2.smooth();
    console.log('here is stroke2', stroke2);
    view.draw();
    view.update();
  });

  //referencing https://github.com/byrichardpowell/draw/blob/master/public/javascripts/canvas.js
  //for drawing a path in real time

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
  // socket.on('friendSending', function(data) {
  //   console.log('friendSending', JSON.parse(data));
  // })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRTs7QUFFekQsb0JBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQyxxQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOzs7QUNQSCxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUN2RCxNQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQztBQUNsQixXQUFTLFFBQVEsR0FBSTtBQUNuQixXQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLFNBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsU0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN6QixDQUFDO0FBQ0YsVUFBUSxFQUFFLENBQUM7OztBQUdYLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O0FBRXRCLE1BQUksTUFBTSxDQUFDO0FBQ1gsTUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV0QixNQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ2xDLFVBQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3BCLFVBQU0sQ0FBQyxTQUFTLEdBQUc7QUFDakIsU0FBRyxFQUFFLElBQUksQ0FB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Q0FBQyxLQUFLLEVBQUU7QUFDNUMsZUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztPQUNsRDtLQUNGO0dBQ0YsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkRELFFBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7Q0FNdEMsQ0FBQyxDQUFDOzs7QUNqTUgsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUM3QyxTQUFPO0FBQ0wsY0FBVSxFQUFFLHNCQUFZO0FBQ3RCLGFBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDcEIsSUFBSSxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQ3hCLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQztPQUN0QixDQUFDLENBQUM7S0FDSjtHQUNGLENBQUE7Q0FDRixDQUFDLENBQUM7OztBQ1RILEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxjQUFjLEVBQUU7QUFDakMsa0JBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFdBQUcsRUFBRSxHQUFHO0FBQ1IsbUJBQVcsRUFBRSxxQkFBcUI7QUFDbEMsa0JBQVUsRUFBRSxnQkFBZ0I7S0FDL0IsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7QUNOSCxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxZQUFVO0FBQ2pDLFFBQU87QUFDTixVQUFRLEVBQUUsR0FBRztBQUNiLGFBQVcsRUFBRSx5QkFBeUI7RUFDdEMsQ0FBQztDQUNGLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNZWFuaXNjdWxlJywgWyd1aS5yb3V0ZXInLCAnZmlyZWJhc2UnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICB2YXIgc29ja2V0ID0gaW8oKTtcbiAgZnVuY3Rpb24gaW5pdGlhdGUgKCkgeyBcbiAgICBjb25zb2xlLmxvZygnaW5pdGlhdGVkIScpO1xuICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbiAgICBwYXBlci5zZXR1cChcIm15Q2FudmFzXCIpO1xuICB9O1xuICBpbml0aWF0ZSgpO1xuXG4gIC8vIERyYXdpbmcgb24gdGhlIG5pZ2h0IHNreVxuICB2YXIgdG9vbCA9IG5ldyBUb29sKCk7XG5cbiAgdmFyIHN0cm9rZTtcbiAgdmFyIHBhdGhfdG9fc2VuZCA9IHt9O1xuXG4gIHRvb2wub25Nb3VzZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBzdHJva2UgPSBuZXcgUGF0aCgpO1xuICAgIHN0cm9rZS5maWxsQ29sb3IgPSB7XG4gICAgICBodWU6IE1hdGgucmFuZG9tKCkgKiAzNjAsXG4gICAgICBzYXR1cmF0aW9uOiAxLFxuICAgICAgYnJpZ2h0bmVzczogMVxuICAgIH07XG4gICAgc3Ryb2tlLmFkZChldmVudC5wb2ludCk7XG5cbiAgLy9kZWZpbmluZyB3aGF0IHRvIHNlbmQgdmlhIHNvY2tldHNcbiAgICBwYXRoX3RvX3NlbmQgPSB7XG4gICAgICBjb2xvcjogc3Ryb2tlLmZpbGxDb2xvcixcbiAgICAgIHN0YXJ0OiBldmVudC5wb2ludCxcbiAgICAgIHN0cm9rZTogW11cbiAgICB9O1xuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIGV2ZW50LnBvaW50IG9uTW91c2VEb3duJywgZXZlbnQucG9pbnQpO1xuICB9O1xuXG4gIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc3RlcCA9IGV2ZW50LmRlbHRhLmRpdmlkZSgyKVxuICAgIHN0ZXAuYW5nbGUgKz0gOTA7XG5cbiAgICB2YXIgdG9wID0gZXZlbnQubWlkZGxlUG9pbnQuYWRkKHN0ZXApO1xuICAgIHZhciBib3R0b20gPSBldmVudC5taWRkbGVQb2ludC5zdWJ0cmFjdChzdGVwKTtcblxuICAgIHN0cm9rZS5hZGQodG9wKTtcbiAgICBzdHJva2UuaW5zZXJ0KDAsIGJvdHRvbSk7XG4gICAgc3Ryb2tlLnNtb290aCgpO1xuXG4gICAgcGF0aF90b19zZW5kLnN0cm9rZS5wdXNoKHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgYm90dG9tOiBib3R0b21cbiAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyBldmVudC5wb2ludCBvbk1vdXNlRHJhZycsIGV2ZW50LnBvaW50KTtcbiAgICAvL2VtaXR0aW5nIG15IGRyYXdpbmdcbiAgICBzb2NrZXQuZW1pdCgnbWVEcmF3aW5nJywgSlNPTi5zdHJpbmdpZnkocGF0aF90b19zZW5kKSk7XG4gIH1cblxuICB0b29sLm9uTW91c2VVcCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0cm9rZS5hZGQoZXZlbnQucG9pbnQpO1xuICAgIHN0cm9rZS5jbG9zZWQgPSB0cnVlO1xuICAgIHN0cm9rZS5zbW9vdGgoKTtcbiAgfVxuXG4gIC8vIFdoZW4gc29tZW9uZSBlbHNlIHN0YXJ0cyBkcmF3aW5nXG4gIHNvY2tldC5vbignZnJpZW5kc0RyYXdpbmcnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZygnZnJpZW5kc0RyYXdpbmcnLCBKU09OLnBhcnNlKGRhdGEpKTtcbiAgICAgIHZhciBzdHJva2UyID0gbmV3IFBhdGgoKTtcbiAgICAgIHZhciBmcmllbmRzRHJhd2luZyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB2YXIgZWFjaFN0cm9rZSA9IGZyaWVuZHNEcmF3aW5nLnN0cm9rZTtcbiAgICAgIHZhciBzdGFydF9wb2ludCA9IG5ldyBQb2ludChmcmllbmRzRHJhd2luZy5zdGFydFsxXSwgZnJpZW5kc0RyYXdpbmcuc3RhcnRbMl0pXG4gICAgICB2YXIgY29sb3IgPSBmcmllbmRzRHJhd2luZy5jb2xvclxuICAgICAgc3Ryb2tlMi5maWxsQ29sb3IgPSBjb2xvcjtcbiAgICAgIHN0cm9rZTIuYWRkKHN0YXJ0X3BvaW50KTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlYWNoU3Ryb2tlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0cm9rZTIuYWRkKG5ldyBQb2ludChlYWNoU3Ryb2tlW2ldLnRvcFsxXSwgZWFjaFN0cm9rZVtpXS50b3BbMl0pKTtcbiAgICAgICAgc3Ryb2tlMi5pbnNlcnQoMCwgbmV3IFBvaW50KGVhY2hTdHJva2VbaV0uYm90dG9tWzFdLCBlYWNoU3Ryb2tlW2ldLmJvdHRvbVsyXSkpO1xuICAgICAgfVxuICAgICAgc3Ryb2tlMi5zbW9vdGgoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdoZXJlIGlzIHN0cm9rZTInLCBzdHJva2UyKTtcbiAgICAgIHZpZXcuZHJhdygpO1xuICAgICAgdmlldy51cGRhdGUoKTtcbiAgfSk7XG5cblxuICAvL3JlZmVyZW5jaW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9ieXJpY2hhcmRwb3dlbGwvZHJhdy9ibG9iL21hc3Rlci9wdWJsaWMvamF2YXNjcmlwdHMvY2FudmFzLmpzXG4gIC8vZm9yIGRyYXdpbmcgYSBwYXRoIGluIHJlYWwgdGltZVxuXG4gIC8vcmVmZXJlbmNpbmcgaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIXRvcGljL3BhcGVyanMvY21RRlFOVFZBQmdcbiAgLy92aWV3LnVwZGF0ZSBjYWxsZWQgaW4gc29ja2V0IGxpc3RlbmVyXG4gIC8vbWlnaHQgY29uZmxpY3Qgd2l0aCB0aGUgcHJvZ3Jlc3NfZXh0ZXJuYWxfcGF0aCBmcm9tIGFib3ZlXG5cblxuICAvL1B1dHRpbmcgc3RhcnMgb24gdGhlIG5pZ2h0IHNreVxuXG4gIHZhciBjZW50ZXIgPSB2aWV3LmNlbnRlcjtcbiAgdmFyIHBvaW50cyA9IDU7XG4gIHZhciByYWRpdXMxID0gNTtcbiAgdmFyIHJhZGl1czIgPSAxMDtcbiAgdmFyIHN0YXIgPSBuZXcgUGF0aC5TdGFyKGNlbnRlciwgcG9pbnRzLCByYWRpdXMxLCByYWRpdXMyKTtcbiAgXG4gIHN0YXIuc3R5bGUgPSB7XG4gICAgZmlsbENvbG9yOiAneWVsbG93J1xuICB9XG5cbiAgdmFyIHN0YXJBcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgIHZhciBzdGFyQ29weSA9IHN0YXIuY2xvbmUoKTtcbiAgICB2YXIgcmFuZG9tUG9zaXRpb24gPSBQb2ludC5yYW5kb20oKTtcbiAgICByYW5kb21Qb3NpdGlvbi54ID0gcmFuZG9tUG9zaXRpb24ueCAqIHZpZXcuc2l6ZS5fd2lkdGg7XG4gICAgcmFuZG9tUG9zaXRpb24ueSA9IHJhbmRvbVBvc2l0aW9uLnkgKiB2aWV3LnNpemUuX2hlaWdodDtcbiAgICBzdGFyQ29weS5wb3NpdGlvbiA9IHJhbmRvbVBvc2l0aW9uO1xuICAgIHN0YXJDb3B5LnJvdGF0ZShNYXRoLnJhbmRvbSgpICogMjApO1xuICAgIHN0YXJDb3B5LnNjYWxlKDAuMjUgKyBNYXRoLnJhbmRvbSgpICogMC43NSk7XG4gICAgc3RhckNvcHkub25Nb3VzZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5vcGFjaXR5ID0gTWF0aC5yYW5kb20oKTtcbiAgICB9XG4gICAgc3RhckFyci5wdXNoKHN0YXJDb3B5KTtcbiAgfVxuXG4gIHN0YXIucmVtb3ZlKCk7XG5cbiAgdmlldy5vbkZyYW1lID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHN0YXJBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJBcnJbaV0uZmlsbENvbG9yLmh1ZSArPSAgKDEgLSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpICogMikgKiAoTWF0aC5yYW5kb20oKSAqIDUpO1xuICAgICAgc3RhckFycltpXS5yb3RhdGUoTWF0aC5yYW5kb20oKSk7XG4gICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggKz0gc3RhckFycltpXS5ib3VuZHMud2lkdGggLyAyMDA7XG4gICAgICBpZiAoc3RhckFycltpXS5ib3VuZHMubGVmdCA+IHZpZXcuc2l6ZS53aWR0aCkge1xuICAgICAgICBzdGFyQXJyW2ldLnBvc2l0aW9uLnggPSAtc3RhckFycltpXS5ib3VuZHMud2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvLyB2YXIgYmxhY2tTcXVhcmUgPSBQYXRoLlJlY3RhbmdsZShuZXcgUG9pbnQoMCwwKSwgbmV3IFNpemUodmlldy5zaXplLl93aWR0aCx2aWV3LnNpemUuX2hlaWdodCkpO1xuICAvLyBibGFja1NxdWFyZS5maWxsQ29sb3IgPSAneWVsbG93JztcbiAgLy8gYmxhY2tTcXVhcmUub3BhY2l0eSA9IDAuODU7XG4gIC8vIGJsYWNrU3F1YXJlID0gbmV3IExheWVyKCk7XG5cbiAgLy8gLy9jcmVhdGluZyBuZXcgdG9vbCB0byBjbGVhciB0aGUgbmlnaHQgc2t5IG9yIFwiZXJhc2VcIiB0aGUgYmxhY2tDb3ZlciBvbiBhIHBhdGhcbiAgLy8gdmFyIHRvb2wyID0gbmV3IFRvb2woKTtcblxuICAvLyB2YXIgc3Ryb2tlMjtcbiAgLy8gdmFyIHBhdGhfdG9fc2VuZDIgPSB7fTtcblxuICAvLyAvLyBwcm9qZWN0LmxheWVyc1sxXS5pbnNlcnRDaGlsZCgwLCBzdHJva2UyKTtcbiAgLy8gdG9vbDIub25Nb3VzZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gICBzdHJva2UyID0gbmV3IFBhdGgoKTtcbiAgLy8gICBzdHJva2UyLmZpbGxDb2xvciA9ICdncmVlbic7IC8vdGhlIGNvbG9yIGRvZXMgbm90IGFmZmVjdCB0aGUgZnVuY3Rpb25hbGl0eVxuICAvLyAgIHN0cm9rZTIub3BhY2l0eSA9IDE7XG4gIC8vICAgc3Ryb2tlMi5zdHJva2VXaWR0aCA9IDIwO1xuICAvLyAgIC8vIHN0cm9rZTIuYmxlbmRNb2RlID0gJ2Rlc3RpbmF0aW9uLW91dCc7IC8vY29uZmxpY3RzIHdpdGggc3Ryb2tlMi5maWxsQ29sb3JcbiAgLy8gICBzdHJva2UyLmFkZChldmVudC5wb2ludCk7XG4gIC8vIC8vIC8vZGVmaW5pbmcgd2hhdCB0byBzZW5kIHZpYSBzb2NrZXRzXG4gIC8vICAgcGF0aF90b19zZW5kMiA9IHtcbiAgLy8gICAgIGNvbG9yOiBzdHJva2UyLmZpbGxDb2xvcixcbiAgLy8gICAgIHN0YXJ0OiBldmVudC5wb2ludCxcbiAgLy8gICAgIHN0cm9rZTI6IFtdXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gdG9vbDIub25Nb3VzZURyYWcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gICB2YXIgc3RlcCA9IGV2ZW50LmRlbHRhLmRpdmlkZSgyKVxuICAvLyAgIHN0ZXAuYW5nbGUgKz0gOTA7XG5cbiAgLy8gICB2YXIgdG9wID0gZXZlbnQubWlkZGxlUG9pbnQuYWRkKHN0ZXApO1xuICAvLyAgIHZhciBib3R0b20gPSBldmVudC5taWRkbGVQb2ludC5zdWJ0cmFjdChzdGVwKTtcblxuICAvLyAgIHN0cm9rZTIuYWRkKHRvcCk7XG4gIC8vICAgc3Ryb2tlMi5pbnNlcnQoMCwgYm90dG9tKTtcbiAgLy8gICBzdHJva2UyLnNtb290aCgpO1xuXG4gIC8vICAgcGF0aF90b19zZW5kMi5zdHJva2UyLnB1c2goe1xuICAvLyAgICAgdG9wOiB0b3AsXG4gIC8vICAgICBib3R0b206IGJvdHRvbVxuICAvLyAgIH0pO1xuXG4gIC8vICAgLy9lbWl0dGluZyBteSBkcmF3aW5nXG4gIC8vICAgc29ja2V0LmVtaXQoJ2NsZWFyaW5nVGhlU2t5JywgSlNPTi5zdHJpbmdpZnkocGF0aF90b19zZW5kMikpO1xuICAvLyB9XG5cbiAgLy8gdG9vbDIub25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vICAgc3Ryb2tlMi5hZGQoZXZlbnQucG9pbnQpO1xuICAvLyAgIHN0cm9rZTIuY2xvc2VkID0gdHJ1ZTtcbiAgLy8gICBzdHJva2UyLnNtb290aCgpO1xuICAvLyB9XG4gIFxuICAvLyBzb2NrZXQub24oJ2ZyaWVuZHNTZW5kaW5ndGhlTmlnaHQnLCBmdW5jdGlvbihkYXRhKSB7XG4gIC8vICAgICBjb25zb2xlLmxvZygnZnJpZW5kc1NlbmRpbmd0aGVOaWdodCcsIEpTT04ucGFyc2UoZGF0YSkpO1xuICAvLyB9KTtcblxuICAvL3Byb2plY3QgcmVmZXJzIHRoZSB3b3JrIGRvbmUgb24gdGhlIGNhbnZhc1xuICBzb2NrZXQuZW1pdCgnc2VuZHRoZU5pZ2h0JywgcHJvamVjdCk7XG4gIC8vIHNvY2tldC5vbignZnJpZW5kU2VuZGluZycsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZnJpZW5kU2VuZGluZycsIEpTT04ucGFyc2UoZGF0YSkpO1xuICAvLyB9KVxuICAvLyBleHBvcnRpbmcgZnVuY3Rpb25zIHRvIHVzZSBpbiBzZXJ2ZXIvYXBwL2luZGV4LmpzXG4gIC8vIG1vZHVsZS5leHBvcnRzID0gcHJvZ3Jlc3NfZXh0ZXJuYWxfcGF0aDtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ0RyYXdpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZENhbnZhczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChcIi9cIilcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICB9KTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJuYXZiYXJcIiwgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogXCJFXCIsXG5cdFx0dGVtcGxhdGVVcmw6IFwiL2FwcC9uYXZiYXIvbmF2YmFyLmh0bWxcIlxuXHR9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9