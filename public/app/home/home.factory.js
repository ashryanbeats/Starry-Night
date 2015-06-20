app.factory('DrawingFactory', function ($http) {
  return {
    loadCanvas: function () {
      return $http.get("/")
      .then(function (response) {
        return response.data;
      });
    }
  }
});