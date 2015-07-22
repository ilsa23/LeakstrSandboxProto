angular.module('app')
  .factory('Auth', function($http, LocalService, AccessLevels, ServerAddress, CurrentUser,$cordovaDialogs,PushNotificationHandler) {
    var currentUser = CurrentUser.user;
    return {
      userData: function(){
        var userInfo = $http.get(ServerAddress+'/user/'+currentUser().id);
        return userInfo;
      },
      authorize: function(access) {
        if (access === AccessLevels.user) {
          return this.isAuthenticated();
        } else {
          return true;
        }
      },
      isAuthenticated: function() {
        return LocalService.get('auth_token');
      },
      login: function(credentials) {
        var login = $http.post(ServerAddress+'/auth/authenticate', credentials);
        login.success(function(result) {
          //$cordovaDialogs.alert("ok1");
          LocalService.set('auth_token', JSON.stringify(result));
          //$cordovaDialogs.alert("ok2");
            if(LocalService.get('push_token')){
              //$cordovaDialogs.alert("ok3");
              PushNotificationHandler
              .registerDevice(LocalService.get('push_token'))
              .success(function(result){
                console.log("registerDevice");
                console.log(result);
                $cordovaDialogs.alert("RegisterDevice OK");
                console.log("RegisterDevice OK");
                return true;
              }).error(function(error) {
                $cordovaDialogs.alert("RegisterDevice error");
                console.log("RegisterDevice error");
                console.log(error);
                return false;
              });
            }          
        });
        return login;
      },
      logout: function() {
        // The backend doesn't care about logouts, delete the token and you're good to go.
        LocalService.unset('auth_token');
      },
      register: function(formData) {
        LocalService.unset('auth_token');
        var register = $http.post(ServerAddress+'/auth/register', formData);

        register.success(function(result) {
            LocalService.set('auth_token', JSON.stringify(result));
            if(LocalService.get('push_token')){
              PushNotificationHandler
              .registerDevice(LocalService.get('push_token'))
              .success(function(result){
                console.log("registerDevice");
                console.log(result);
                $cordovaDialogs.alert("RegisterDevice OK");
                console.log("RegisterDevice OK");
                return true;
              }).error(function(error) {
                $cordovaDialogs.alert("RegisterDevice error");
                console.log("RegisterDevice error");
                console.log(error);
                return false;
              });
            }
        });
        return register;
      }
    }
  })
  .factory('AuthInterceptor', function($q, $injector) {
    var LocalService = $injector.get('LocalService');

    return {
      request: function(config) {
        var token;
        if (LocalService.get('auth_token')) {
          token = angular.fromJson(LocalService.get('auth_token')).token;
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          //LocalService.unset('auth_token');
          //$injector.get('$state').go('anon.login');
          //alert("Response Error");
          console.log("Response Error");
          console.log(response);
        }
        return $q.reject(response);
      }
    }
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });