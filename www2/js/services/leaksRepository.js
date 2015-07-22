angular.module('app')
  .factory('Leaks', function($http, CurrentUser, ServerAddress, LocalService) {
    var currentUser = CurrentUser.user;
    return {
      getFeed: function(){
        return $http.get(ServerAddress + '/follow/getFeed');
      },
      getLeak: function(id){
        return $http.get(ServerAddress + '/leak/' + id);
      },
      getWorld: function(){
        return $http.get(ServerAddress + '/leak?limit=100');
      },
      getAll: function() {
        return $http.get(ServerAddress + '/user/' + currentUser().id + '/leaks?limit=100');
      },
      create: function(arguments) {
        arguments.followers = angular.fromJson(LocalService.get('auth_token')).user.id;
        return $http.post(ServerAddress + '/user/' + currentUser().id + '/leaks', arguments);
      },
      remove: function(message) {
        return $http.delete(ServerAddress + '/user/' + currentUser().id + '/leaks/' + message.id);
      },
      getLeaksByUser: function(id){
        return $http.get(ServerAddress + '/follow/getLeaksByUser?id=' + id);
      },
      getLeaksByContent: function(content){
        return $http.post(ServerAddress + '/follow/findLeakByContent',{leakContent:content});
      },
      followLeak: function(id){
        return $http.put(ServerAddress + '/leak/' + id ,{followers:angular.fromJson(LocalService.get('auth_token')).user.id});
      },
      followUser: function(id){
        return $http.post(ServerAddress + '/follow/followUserWithID?id='+id);
      },
      setComment: function(comment,leakID){
        return $http.post(ServerAddress + '/comment/',{owner: currentUser().id, leak: leakID, text:comment});
      },
      getComments: function(leakID){
        return $http.get(ServerAddress + '/comment?where={"leak":"'+leakID+'"}');
      }
    }
  });