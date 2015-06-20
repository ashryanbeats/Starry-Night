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

  $scope.msgFromScope = 'Try drawing something here!';

  // var myCircle = new Path.Circle(new Point(100, 70), 50);

  var myCircle = new Path.Circle({
    center: view.center,
    radius: 30,
    fillColor: 'red'
  });

  var destination = Point.random() * view.size;

  view.onFrame = function (event) {
    // Each frame, change the fill color of the path slightly by
    // adding 1 to its hue:
    myCircle.fillColor.hue += 1;

    // var vector = destination - myCircle.position;

    // myCircle.position += vector / 30;

    // myCircle.content = Math.round(vector.length);

    // if(vector.length < 5) {

    //   destination = Point.random() * view.size;
    // }

    socket.emit('sendCircle', myCircle);
  };

  socket.on('gotIt', function (data) {
    console.log('jfkdlasjfdsklfjaslfjdkjf DATTATA', data);
  });
});
// tool.onMouseDown = function onMouseDown (event) {
//   drag = true;
// };

// tool.onMouseDrag = function onMouseDrag (event) { 

// };

// tool.onMouseUp = function onMouseUp () {
//   drag = false;
// };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLmZhY3RvcnkuanMiLCJob21lL2hvbWUuc3RhdGUuanMiLCJuYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOztBQUVuRixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUU7O0FBRXpELG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMscUJBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3BDLENBQUMsQ0FBQzs7O0FDUEgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO0FBQ3ZFLE1BQUksTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDOztBQUVsQixXQUFTLFFBQVEsR0FBSTtBQUNuQixXQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLFNBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsU0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN6QixDQUFDOztBQUVGLFVBQVEsRUFBRSxDQUFDOztBQUVYLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7Ozs7QUFJdEIsUUFBTSxDQUFDLFlBQVksR0FBRyw2QkFBNkIsQ0FBQzs7OztBQUlwRCxNQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0IsVUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLFVBQU0sRUFBRSxFQUFFO0FBQ1YsYUFBUyxFQUFFLEtBQUs7R0FDakIsQ0FBQyxDQUFDOztBQUVILE1BQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUU3QyxNQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFFOzs7QUFHOUIsWUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYTVCLFVBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDLENBQUE7O0FBRUQsUUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxJQUFJLEVBQUU7QUFDaEMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN2RCxDQUFDLENBQUE7Q0FjSCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDOURILEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDN0MsU0FBTztBQUNMLGNBQVUsRUFBRSxzQkFBWTtBQUN0QixhQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQ3BCLElBQUksQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUN4QixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0o7R0FDRixDQUFBO0NBQ0YsQ0FBQyxDQUFDOzs7QUNUSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFO0FBQ2pDLGtCQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN6QixXQUFHLEVBQUUsR0FBRztBQUNSLG1CQUFXLEVBQUUscUJBQXFCO0FBQ2xDLGtCQUFVLEVBQUUsZ0JBQWdCO0tBQy9CLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7O0FDTkgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsWUFBVTtBQUNqQyxRQUFPO0FBQ04sVUFBUSxFQUFFLEdBQUc7QUFDYixhQUFXLEVBQUUseUJBQXlCO0VBQ3RDLENBQUM7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnTWVhbmlzY3VsZScsIFsndWkucm91dGVyJywgJ2ZpcmViYXNlJywgJ2htVG91Y2hFdmVudHMnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJGZpcmViYXNlQXJyYXkpIHtcbiAgdmFyIHNvY2tldCA9IGlvKCk7XG5cbiAgZnVuY3Rpb24gaW5pdGlhdGUgKCkgeyBcbiAgICBjb25zb2xlLmxvZygnaW5pdGlhdGVkIScpO1xuICAgIHBhcGVyLmluc3RhbGwod2luZG93KTtcbiAgICBwYXBlci5zZXR1cChcIm15Q2FudmFzXCIpO1xuICB9O1xuXG4gIGluaXRpYXRlKCk7XG5cbiAgdmFyIHRvb2wgPSBuZXcgVG9vbCgpO1xuICAvLyB2YXIgZHJhd2luZ1JlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vd2hlcmV5b3VyZHJhd2luZ2dldHNsb3N0LmZpcmViYXNlaW8uY29tXCIpO1xuICAvLyB2YXIgZHJhd2luZyA9ICRmaXJlYmFzZUFycmF5KGRyYXdpbmdSZWYpO1xuXG4gICRzY29wZS5tc2dGcm9tU2NvcGUgPSBcIlRyeSBkcmF3aW5nIHNvbWV0aGluZyBoZXJlIVwiO1xuXG4gIC8vIHZhciBteUNpcmNsZSA9IG5ldyBQYXRoLkNpcmNsZShuZXcgUG9pbnQoMTAwLCA3MCksIDUwKTtcblxuICB2YXIgbXlDaXJjbGUgPSBuZXcgUGF0aC5DaXJjbGUoe1xuICAgIGNlbnRlcjogdmlldy5jZW50ZXIsXG4gICAgcmFkaXVzOiAzMCxcbiAgICBmaWxsQ29sb3I6ICdyZWQnXG4gIH0pO1xuXG4gIHZhciBkZXN0aW5hdGlvbiA9IFBvaW50LnJhbmRvbSgpICogdmlldy5zaXplO1xuXG4gIHZpZXcub25GcmFtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vIEVhY2ggZnJhbWUsIGNoYW5nZSB0aGUgZmlsbCBjb2xvciBvZiB0aGUgcGF0aCBzbGlnaHRseSBieVxuICAgIC8vIGFkZGluZyAxIHRvIGl0cyBodWU6XG4gICAgbXlDaXJjbGUuZmlsbENvbG9yLmh1ZSArPSAxO1xuXG4gICAgLy8gdmFyIHZlY3RvciA9IGRlc3RpbmF0aW9uIC0gbXlDaXJjbGUucG9zaXRpb247XG5cbiAgICAvLyBteUNpcmNsZS5wb3NpdGlvbiArPSB2ZWN0b3IgLyAzMDtcblxuICAgIC8vIG15Q2lyY2xlLmNvbnRlbnQgPSBNYXRoLnJvdW5kKHZlY3Rvci5sZW5ndGgpO1xuXG4gICAgLy8gaWYodmVjdG9yLmxlbmd0aCA8IDUpIHtcblxuICAgIC8vICAgZGVzdGluYXRpb24gPSBQb2ludC5yYW5kb20oKSAqIHZpZXcuc2l6ZTtcbiAgICAvLyB9XG5cbiAgICBzb2NrZXQuZW1pdCgnc2VuZENpcmNsZScsIG15Q2lyY2xlKTtcbiAgfVxuXG4gIHNvY2tldC5vbignZ290SXQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2pma2RsYXNqZmRza2xmamFzbGZqZGtqZiBEQVRUQVRBJywgZGF0YSk7XG4gIH0pXG5cbiAgLy8gdG9vbC5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duIChldmVudCkge1xuICAvLyAgIGRyYWcgPSB0cnVlO1xuICAvLyB9O1xuICBcbiAgLy8gdG9vbC5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIG9uTW91c2VEcmFnIChldmVudCkgeyAgXG5cbiAgLy8gfTtcblxuICAvLyB0b29sLm9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcCAoKSB7XG4gIC8vICAgZHJhZyA9IGZhbHNlO1xuICAvLyB9O1xuXG59KTsiLCJhcHAuZmFjdG9yeSgnRHJhd2luZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgcmV0dXJuIHtcbiAgICBsb2FkQ2FudmFzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL1wiKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgIH0pO1xufSk7IiwiYXBwLmRpcmVjdGl2ZShcIm5hdmJhclwiLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiBcIkVcIixcblx0XHR0ZW1wbGF0ZVVybDogXCIvYXBwL25hdmJhci9uYXZiYXIuaHRtbFwiXG5cdH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=