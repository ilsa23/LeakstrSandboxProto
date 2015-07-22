/*var onNotificationAPN =  function(event){
    console.log("onNotificationAPN");
    console.log(event);
}*/
angular.module('app')
  .run(function($http, $cordovaPush, PushNotificationHandler,$rootScope, Auth, $cordovaDialogs, LocalService, $state){
      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        console.log('$cordovaPush:notificationReceived notification2');
        console.log(notification);
        console.log('notification.leakID');
        console.log(notification.leakID);
        $state.go('leakDetail',{id:notification.leakID});
        console.log('$cordovaPush finish');
      });    	
}).factory('PushNotificationHandler', function($rootScope, $state, $q, $http, $cordovaPush, $cordovaDevice, CurrentUser, $cordovaDialogs, LocalService, ServerAddress) {
	var leakPending = [];
	document.addEventListener('deviceready', function(){
		var iosConfig = {
			"badge": true,
			"sound": true,
			"alert": true
		};		
		$cordovaPush.register(iosConfig).then(function(token) {			
			}, function(error) {
				console.log('Cordovapush no server error');
				console.log(error);
				deferred.reject(error);
			});	
	}, false);
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
		console.log('$cordovaPush:notificationReceived notification3');
		console.log(notification);
		console.log('notification.leakID');
		console.log(notification.leakID);
		$state.go('leakDetail',{id:notification.leakID});
		console.log('$cordovaPush finish');
	});  	
	return{
		registerDevice: function(){
			var deferred = $q.defer();
			var iosConfig = {
				"badge": true,
				"sound": true,
				"alert": true
			};
			$cordovaPush.register(iosConfig).then(function(token) {
				console.log("onDeviceReady Token:");
				console.log(token);
				LocalService.set('push_token', token);
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
					$http.post(ServerAddress + '/user/' + currentUser().id + '/hardwareData', data).success(function(data) {
						deferred.resolve(data);
					}).error(function(error){
						console.log('error in post hardwareData');
						console.log(error);
						deferred.reject(error);
					});
				}				
			}, function(error) {
				console.log('Cordovapush error');
				console.log(error);
				deferred.reject(error);
			});
			return deferred.promise;
		},
		addPending: function(leakID){
			leakPending.push(leakID);
		}
	}
  });