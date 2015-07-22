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
  .factory('SocialAuth', function($http, ServerAddress, LocalService){
    var unescapeMe = function (str){
    return str.replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, "&");
    }

    return {
      login: function(data){
          console.log('login data',JSON.stringify(data));
          LocalService.unset('auth_token');
          var register = $http.post(ServerAddress+'/auth/loginWithNetwork', {token: data.token, user: {id:data.user.id}, network:data.network});
          register.success(function(result) {
            console.log('result',result);
            LocalService.set('auth_token', JSON.stringify(result));
          });
          return register;
      },
      register: function(data){
          console.log('register data',data);
          LocalService.unset('auth_token');
          var register = $http.post(ServerAddress+'/auth/registerWithNetwork', data);
          register.success(function(result) {
            console.log('result',result);
            LocalService.set('auth_token', JSON.stringify(result));
          });
          return register;
      }
    };
  })
  .factory('SocialData',function(){
    var userData ={};
    console.log('SocialData in');
    var unescapeMe = function (str){
    return str.replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, "&");
    };    
    var parseData = function(data){
      var parse = decodeURIComponent(data);
      parse = unescapeMe(parse);
      var buffer = angular.fromJson(parse);
      return buffer;
    };
    return {
      parseData: parseData,
      addData: function(data){
        console.log('parseData');
        userData = parseData(data);
        console.log('userData',userData);
      },
      getData: function(){
        return userData;
      }
    };
  })
  .factory('AuthInterceptor', function($q, $injector, $cordovaDialogs) {
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
          $cordovaDialogs.alert(response.data);
        }
        return $q.reject(response);
      }
    }
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });