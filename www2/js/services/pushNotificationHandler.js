/*var onNotificationAPN =  function(event){
    console.log("onNotificationAPN");
    console.log(event);
}*/
angular.module('app')
  .run(function($http, $cordovaPush, PushNotificationHandler,$rootScope, Auth, $cordovaDialogs, LocalService){
	  var iosConfig = {
	    "badge": true,
	    "sound": true,
	    "alert": true
	  };

	 
	  var registerTheDevice = function(){
	    Auth.userData().success(function(data){
	    	console.log('data');
	    	console.log(data);
	    	console.log('auth_token');
	    	console.log(LocalService.get('auth_token'));
	    }).error(function(error){
	      	console.log('error');
	      	console.log(error);
	      	$cordovaDialogs.alert('Usuario no encontrado', 'Oops parece que tenemos un problema', 'OK');
	      	Auth.logout();
	      	app.mainnavi.pushPage('templates/auth/registerOrLogin.html');
	    });
		$cordovaPush.register(iosConfig).then(function(token) {
		  console.log("onDeviceReady Token:");
		  console.log(token);
		  //PushNotificationHandler.registerDevice(LocalService.get('push_token'));
		  LocalService.set('push_token', token);
		}, function(err) {
		  $cordovaDialogs.alert("Registration token error: ");
		  console.log('Registration token error:');
		  console.log(err);
		});
	};
	window.onload = registerTheDevice;
	document.addEventListener("deviceready", function(){
	    Auth.userData().success(function(data){
	    	console.log('data');
	    	console.log(data);
	    	console.log('auth_token');
	    	console.log(LocalService.get('auth_token'));
	    }).error(function(error){
	      	console.log('error');
	      	console.log(error);
	      	$cordovaDialogs.alert('Usuario no encontrado', 'Oops parece que tenemos un problema', 'OK');
	      	Auth.logout();
	      	app.mainnavi.pushPage('templates/auth/registerOrLogin.html');
	    });
		$cordovaPush.register(iosConfig).then(function(token) {
		  console.log("onDeviceReady Token:");
		  console.log(token);
		  //PushNotificationHandler.registerDevice(LocalService.get('push_token'));
		  LocalService.set('push_token', token);
		}, function(err) {
		  $cordovaDialogs.alert("Registration token error: ");
		  console.log('Registration token error:');
		  console.log(err);
		});
	} , false);
	/*$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    	console.log('$cordovaPush:notificationReceived notification');
    	console.log(notification);
    	console.log('notification.leakID');
    	console.log(notification.leakID);
    	app.navi.pushPage('templates/user/leakDetail.html',{id:leakID});
    	console.log('$cordovaPush finish');
	});*/
	
}).factory('PushNotificationHandler', function($http, $cordovaPush, $cordovaDevice, CurrentUser, $cordovaDialogs, LocalService, ServerAddress) {
	var leakPending = [];
	return{
		registerDevice: function(token){
			var currentUser = CurrentUser.user;
			var deviceInfo = $cordovaDevice.getDevice();
			console.log("DeviceInfo");
			console.log(deviceInfo);
			if(currentUser().id){
				console.log('currentUserid: '+currentUser().id);
				var data = {
					os: deviceInfo["platform"],
					uid: deviceInfo["uuid"],
					pushToken: token
				};
				console.log('deviceInfo');
				console.log(data);
				var register = $http.post(ServerAddress + '/user/' + currentUser().id + '/hardwareData', data);
				return register;
			}
		},
		addPending: function(leakID){
			leakPending.push(leakID);
		}
	}
  });