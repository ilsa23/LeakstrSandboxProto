angular.module('app')
  .factory('Leaks', function($http, CurrentUser, ServerAddress, LocalService) {
    var currentUser = CurrentUser.user;

    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };
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
      createNew: function(arguments){
        arguments.followers = angular.fromJson(LocalService.get('auth_token')).user.id;
        var fd = new FormData();
        fd.append('name', arguments.name);
        fd.append('body', arguments.body);
        fd.append('date', arguments.date);
        fd.append('photo', dataURItoBlob(arguments.photo));
        fd.append('photoBlured', dataURItoBlob(arguments.photoBlured));
        return $http.post(ServerAddress + '/leak/createALeak', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
      },
      remove: function(message) {
        return $http.delete(ServerAddress + '/user/' + currentUser().id + '/leaks/' + message.id);
      },
      getLeaksByUser: function(id){
        return $http.get(ServerAddress + '/follow/getLeaksByUser?id=' + id);
      },
      getMyLeaks: function(){
        return $http.get(ServerAddress + '/follow/getLeaksByUser?id=' + angular.fromJson(LocalService.get('auth_token')).user.id);
      },
      getLeaksByContent: function(content){
        return $http.post(ServerAddress + '/follow/findLeakByContent',{leakContent:content});
      },
      followLeak: function(id){
        return $http.put(ServerAddress + '/follow/followLeak',{id:id});
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