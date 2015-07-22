angular.module('app')
  .factory('Followers', function($http, CurrentUser, ServerAddress) {
    var currentUser = CurrentUser.user;
    return {
      findUser: function(name){
        return $http.get(ServerAddress + '/follow/finduser?name=' + name);
      }
    }
  });