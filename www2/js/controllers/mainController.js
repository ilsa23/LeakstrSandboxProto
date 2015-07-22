angular.module('app')
  .controller('MainController', function($scope, Leaks, $rootScope, $cordovaDialogs,PushNotificationHandler, CurrentUser) {
  	$scope.loadingScreen = false;
  	console.log('CurrentUser.user()');
	  console.log(CurrentUser.user());
  	ons.ready(function(){
	  	console.log('CurrentUser.user().id',CurrentUser.user().id);
	  	if(!CurrentUser.user().id){
        console.log('no user id');
	  		app.mainnavi.pushPage('templates/auth/registerOrLogin.html');
	  	}

	  	$scope.testme = function(){
	  		$rootScope.$broadcast('testing',{leakID:"54d91f12e992d8ce1281873b"});
	  	};
  	});
    $scope.$on('loading',function(event,value){
    	$scope.loadingScreen = value;
    });
  });