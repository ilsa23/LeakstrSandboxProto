
myApp.config(function($stateProvider, $urlRouterProvider) {
	//FastClick.attach(document.body);
	$urlRouterProvider.otherwise("/loginOcrea");
	document.addEventListener('resume', function(){
		console.log('document.resume');
	}, false);
	document.addEventListener('pause', function(){
		console.log('document.pause');
	}, false);
	document.addEventListener('deviceready', function(){
		console.log('document.deviceready');
	}, false);
	$stateProvider
		.state('loginOcrea', {
			url: "/loginOcrea",
			templateUrl: "partials/loginOcrea.html",
			controller: function($scope, $state, $stateParams, Auth, CurrentUser, $cordovaInAppBrowser, ServerAddress) {
				console.groupCollapsed('loginOcrea controller');

				$scope.$state = $state;
				$scope.$stateParams = $stateParams;
				console.log('CurrentUser.user()',CurrentUser.user());
				if(CurrentUser.user()!=false)
					$state.go('leaks');
				$scope.clickOnFacebook = function(){
					 window.open(ServerAddress+'/auth/networkcallback/facebook', '_system');
				};
				$scope.clickOnTwitter = function(){
					window.open(ServerAddress+'/auth/networkcallback/twitter', '_system');
				};
				console.groupEnd();
			}
		})
		.state('leaks', {
			url: "/leaks",
			templateUrl: "partials/leaks.html",
			controller: function($rootScope, $scope, $http, $interval, Auth, Leaks, $state, $stateParams, Countdown, PushNotificationHandler, ServerAddress) {
				console.groupCollapsed('leaks controller');

				$scope.$state = $state;
				$scope.ServerAddress = ServerAddress;
				$scope.leak = {};
				$scope.leaksWorld = {};
				$scope.leaks = [];

				document.addEventListener('resume', function(){
					console.log('document.resume');
					$scope.refresh(); 
				}, false);

				$scope.logoutme = function(){
					Auth.logout();
					$state.go('loginOcrea');
				};
				$scope.goToLeak = function(theID){
					console.log('goToLeak: '+theID);
					$state.go('leakDetail',{id:theID});
				}
				$scope.refresh = function(){
					$scope.$emit('loading',true);

					/*Leaks.getWorld().then(function(result){
						$scope.$emit('loading',false);
						console.log("leaksWorld: ",result.data); 
						$scope.leaksWorld = result.data;
						Countdown.add($scope.leaksWorld);
					});*/

					Leaks.getFeed().then(function(result) {
						$scope.$emit('loading',false);
						console.log("leaks controller result.data: ",result.data); 
						$scope.leaksWorld = result.data;
						Countdown.add($scope.leaksWorld);
					});

					Leaks.getMyLeaks().then(function(result) {
						$scope.$emit('loading',false);
						console.log("leaks controller result.data: ",result.data); 
						$scope.misLeaks = result.data;
						Countdown.add($scope.misLeaks);
					});

				};
				$scope.refresh();

				/*(function (localScope) {
				  if(mainSocket){
				    mainSocket.get('/leak/',function(data){
				    console.log('/leak get Socket: ');
				    console.log(data);
				    });
				    mainSocket.on('leak',function(data){
				      console.log('/leak on Socket: ');
				      console.log(data);
				      localScope.refresh();
				    });
				  }
				  console.log('cuatro');
				})($scope); */

				
				/*$interval(function(){
					if($scope.leaksWorld.length>0){
						for(var i = 0; i<$scope.leaksWorld.length; i++){
							if(!$scope.leaksWorld[i].processed){
								if(i==$scope.leaksWorld.length-1){
									//console.log('$scope.leaksWorld[0].dateantes',$scope.leaksWorld[i].date);
								}								
								$scope.leaksWorld[i].date -= 1;
								if(i==$scope.leaksWorld.length-1){
									//console.log('$scope.leaksWorld[0].datedespues',$scope.leaksWorld[i].date);
								}
							}
						}
					}
					//console.log('$scope.leaks[0].date',$scope.leaks[$scope.leaks.length-1].date);
				}, 1);*/
				console.groupEnd();
			}
		})
		.state('misAmigos', {
			url: "/misAmigos",
			templateUrl: "partials/misAmigos.html",
			controller: function($scope, Leaks, Followers, $cordovaDialogs, $state){
				console.groupCollapsed('misAmigos controller');
				$scope.$state = $state;
				$scope.foundUsers = {};
				$scope.searchFriend = '';
				$scope.$watch('searchFriend', function() {
					console.log('searching friend: '+$scope.searchFriend);
					if($scope.searchFriend.length>3){
						$scope.$emit('loading',true);
						Followers.findUser($scope.searchFriend).then(function(result){
							$scope.$emit('loading',false);
							$scope.foundUsers = result.data;
							console.log('result',result.data);
						});
					}else{
						$scope.foundUsers = {};
					}
				}, true);
				$scope.followUser = function(theID){
						Leaks.followUser(theID).success(function(data){
								console.log('follow leak success:',data);
								$scope.$emit('loading',false);
							}).error(function(error){
								console.log('follow leak error:',error);
								$scope.$emit('loading',false);
								$cordovaDialogs.alert('DetailController follow','error','OK')
							});	

					if($cordovaDialogs){		
						$cordovaDialogs.confirm('Quieres seguir a este Usuario?', '', ['OK','Cancelar'])
						.then(function(buttonIndex) {
							// no button = 0, 'OK' = 1, 'Cancel' = 2
							if(buttonIndex==1){
								$scope.$emit('loading',true);
								Leaks.followUser(theID).success(function(data){
									console.log('follow leak success:',data);
									$scope.$emit('loading',false);
								}).error(function(error){
									console.log('follow leak error:',error);
									$scope.$emit('loading',false);
									$cordovaDialogs.alert('DetailController follow','error','OK')
								});
							}
						});
					}else{
						$scope.$emit('loading',true);
						Leaks.followUser(theID).success(function(data){
							console.log('follow leak success:',data);
							$scope.$emit('loading',false);
						}).error(function(error){
							console.log('follow leak error:',error);
							$scope.$emit('loading',false);
							$cordovaDialogs.alert('DetailController follow','error','OK')
						});
					}

				};
				console.groupEnd();		
			}
		})
		.state('nuevoLeak', {
			url: "/nuevoLeak",
			templateUrl: "partials/nuevoLeak.html",
			controller: function($scope, $state, $cordovaDialogs, $cordovaDatePicker, Leaks, $cordovaCamera) {
				console.groupCollapsed('nuevoLeak controller');
				$scope.$state = $state;
				$scope.nuevoLeak = {
					name: 'Título',
					body:'Contenido',
					date: new Date().getTime(),
					photoBlured: '',
					photo: ''
				};
				$scope.addName = function(){
					$cordovaDialogs.prompt('Ingresa un Título', 'Título' , ['OK','Cancelar'], $scope.nuevoLeak.name)
					.then(function(result) {
						// no button = 0, 'OK' = 1, 'Cancel' = 2
						if(result.buttonIndex==1){
							$scope.nuevoLeak.name = result.input1;
						}
					});
				};
				$scope.addBody = function(){
					$cordovaDialogs.prompt('Ingresa un Contenido', 'Contenido' , ['OK','Cancelar'], $scope.nuevoLeak.body)
					.then(function(result) {
						// no button = 0, 'OK' = 1, 'Cancel' = 2
						if(result.buttonIndex==1){
							$scope.nuevoLeak.body = result.input1;
						}
					});
				};
				$scope.addFecha = function(){
					var options = {
						date: new Date(),
						mode: 'datetime',
						allowOldDates: false,
						doneButtonLabel: 'OK',
						cancelButtonLabel: 'Cancelar',
						doneButtonColor: '#336ac0'
					};
					$cordovaDatePicker.show(options).then(function(date){
						$scope.nuevoLeak.date = date.getTime();
					});					
				};

				$scope.theBlurSlider = 80;

				$scope.createLeak = function() {
					$scope.$emit('loading',true);
					console.log("Creating Leak: ",$scope.nuevoLeak);
					(function(){
						console.log("Uno");
						Leaks.createNew($scope.nuevoLeak).then(function(result) {
							$scope.$emit('loading',false);
							console.log("Leak Response: ");
							console.log(result);
							$scope.leaksWorld = {};
							$state.go('leaks');
						},function(error){
							$scope.$emit('loading',false);
							console.log('error');
							console.log(error);
							$cordovaDialogs.alert('Al parecer tenemos un problema, inténtalo más tarde')
						});
					})();
				};
				$scope.canvas = {
					width: 375,
					heght: 600
				};				
				$scope.takePic = function(){
					var onSuccess = function (imageData) {
						$scope.$emit('loading',false);
					    /*var image = document.getElementById('thePhotoContainer');
					    image.style.backgroundImage = 'url(data:image/jpeg;base64,' + imageData+')';*/
					    /*var image = document.getElementById('thePicContainer');
					    image.src = 'data:image/jpeg;base64,' + imageData;*/
						var canvas = document.getElementById('canvas'),
							context = canvas.getContext('2d');
						(function (){
						  var base_image = new Image();
						  base_image.src = 'data:image/jpeg;base64,' + imageData;
						  base_image.onload = function(){
						  	/*$scope.$watchCollection('theBlurSlider', function() {
						  		context.drawImage(base_image, 0, 0);
						    	stackBlurCanvasRGB('canvas',0,0,375,600,$scope.theBlurSlider);	
						  	});*/
						    context.drawImage(base_image, 0, 0);
						    stackBlurCanvasRGB('canvas',0, 0, 375, 500,$scope.theBlurSlider);
						    $scope.nuevoLeak.photoBlured = canvas.toDataURL("image/jpeg", 1.0);;
						    $scope.nuevoLeak.photo = base_image.src;
						  };
						})();
					};

					var onFail = function (error) {
						$scope.$emit('loading',false);
					    console.log('Failed taking picture');
					    console.log(error);
					};


					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						targetWidth: 375,
						targetHeight: 500
					};
					$scope.$emit('loading',true);
					$cordovaCamera.getPicture(options).then(onSuccess, onFail);
				};
				console.groupEnd();
			}
		})
		.state('leakDetail', {
			url: "/leakDetail/:id",
			templateUrl: "partials/leakDetail.html",
			controller: function($scope, $state, $stateParams, Leaks, Countdown, ServerAddress){
				console.groupCollapsed('leakDetail controller');
				$scope.ServerAddress = ServerAddress;
				$scope.$state = $state;
				$scope.$stateParams = $stateParams;
				console.log('$stateParams',$stateParams);
				$scope.selectedLeak = {};
				$scope.comment = '';
				$scope.$emit('loading',true);
				Leaks.getLeak($stateParams.id).then(function(leakData){
					$scope.$emit('loading',false);
					console.log("leakData");
					console.log(leakData.data);
					$scope.selectedLeak = leakData.data;
					Countdown.add([$scope.selectedLeak]);
					/*(function (localScope) {
						console.log('leak update');
						console.log('/leak/update/'+$scope.selectedLeak.id);
						console.log(io);
						if(mainSocket){
							mainSocket.get('/leak/'+$scope.selectedLeak.id,function(data){
								console.log('/Leak listen to : '+$scope.selectedLeak.id);
								console.log(data);
							});
							mainSocket.on('leak',function(data){
								console.log('/Leak n:'+$scope.selectedLeak.id+' called');
								console.log(data);
								localScope.selectedLeak.body = data.data.body;
								localScope.selectedLeak.processed = data.data.processed;
								localScope.$apply();
							});
						}
					})($scope);*/
				});

				Leaks.getComments($stateParams.id).then(function(allComments){
					$scope.allComments = allComments.data;
					console.log('allComments',allComments.data);
				});

				$scope.follow = function(theID){
					$cordovaDialogs.confirm('Quieres seguir este Leak?', '', ['OK','Cancelar'])
					.then(function(buttonIndex) {
						// no button = 0, 'OK' = 1, 'Cancel' = 2
						if(buttonIndex==1){
							$scope.$emit('loading',true);
							Leaks.followLeak(theID).success(function(data){
								console.log('follow leak success:',data);
								$scope.$emit('loading',false);
							}).error(function(error){
								console.log('follow leak error:',error);
								$scope.$emit('loading',false);
								$cordovaDialogs.alert('DetailController follow','error','OK')
							});
						}
					});
				};
				$scope.sendComment = function(theID){
					console.log('comment',$scope.comment,theID);
					Leaks.setComment($scope.comment,theID).then(function(data){
						console.log(data);
					});
				};
				$scope.goBack = function(){
					Countdown.remove($scope.selectedLeak);
					$state.go('leaks');
				};
				console.groupEnd();
			}
		})
		.state('registro', {
			url: "/registro",
			templateUrl: "partials/registro.html",
			controller: function($scope, $state, $stateParams, Auth, $cordovaDialogs, PushNotificationHandler) {
				console.groupCollapsed('registro controller');
				$scope.$state = $state;
				$scope.$stateParams = $stateParams;
				$scope.user = {};
				$scope.register = function(){
					console.log("usuario");
					console.log($scope.user);
					$scope.$emit('loading',true);
					Auth.register($scope.user).success(function(data) {
						console.log('RegisterController data');
						console.log(data);
						$scope.$emit('loading',false);
						PushNotificationHandler.registerDevice().then(function(data){
							console.log('data');
							console.log(data);
							$state.go('leaks');
						},function(error){
							$state.go('leaks');
							console.log('error PushNotificationHandler.registerDevice()');
							console.log(error);
							$cordovaDialogs.alert('PushNotificationHandler.registerDevice()');
						});
					}).error(function(error){
						console.log('Auth.register error');
						console.log(error);
						$scope.$emit('loading',false);
						$scope.errors.push(err);
						$cordovaDialogs.alert('Parece que hay un problema en la nube, inténtalo más tarde','Error','OK');
					});
				};
				console.groupEnd();
			}
		})
		.state('login', {
			url: "/login",
			templateUrl: "partials/login.html",
			controller: function($scope, $state, $stateParams, Auth, $cordovaDialogs, PushNotificationHandler) {
				console.groupCollapsed('login controller');
				$scope.$state = $state;
				$scope.$stateParams = $stateParams;

				$scope.errors = [];
				$scope.user = {};
				$scope.login = function() {
					$scope.errors = [];
					console.log("login");
					$scope.$emit('loading',true);
					Auth.login($scope.user).success(function(result) {
						console.log(result);
						$scope.$emit('loading',false);
						PushNotificationHandler.registerDevice();
						$state.go('leaks');
					}).error(function(err) {
						console.log('Auth.login error');
						console.log(err);
						$scope.$emit('loading',false);
						$scope.errors.push(err);
						$cordovaDialogs.alert('Error en login','loginController.js','OK');
					});
					console.log("login finish");
				};
				console.groupEnd();
			}
		})
		.state('registerWithSocial',{
			url: "/registerWithSocial",
			templateUrl: "partials/registroSocial.html",
			controller: function($scope, SocialData, SocialAuth, PushNotificationHandler, $state, $cordovaDialogs){
				console.groupCollapsed('registerWithSocial controller');
				console.log('SocialData.getData',SocialData.getData());
				$scope.userSocialData = SocialData.getData().user;
				$scope.username = '';
				$scope.register = function(){
					//$scope.$emit('loading',true);
					var buffer = SocialData.getData();
					buffer.user.username = $scope.username;
					if(!buffer.user.mail)
						buffer.user.mail = $scope.email;
					console.log("buffer");
					console.log(buffer);
					SocialAuth.register(buffer).success(function(data) {
						console.log('RegisterSocialController data');
						console.log(data);
						$scope.$emit('loading',false);
						PushNotificationHandler.registerDevice().then(function(data){
							console.log('data');
							console.log(data);
							$state.go('leaks');
						},function(error){
							console.log('error PushNotificationHandler.registerDevice()');
							console.log(error);
							$cordovaDialogs.alert('PushNotificationHandler.registerDevice()');
						});
					}).error(function(error){
						console.log('Auth.registerSocial error');
						console.log(error);
						$scope.$emit('loading',false);
						$scope.errors.push(err);
						$cordovaDialogs.alert('Error en registerSocial','registerController.js','OK');
					});		
			};
			console.groupEnd();
		}
	});
});

myApp.controller('MainController',function($scope, SocialAuth, SocialData, $cordovaDialogs, $state, PushNotificationHandler){
	console.groupCollapsed('MainController controller');
    $scope.$on('loading',function(event,value){
    	console.log('loading');
    	$scope.loadingScreen = value;
    	if(value)
    		angular.element(document.getElementById('the-ui-view')).css('-webkit-filter','grayscale(0.5) blur(10px)');
    	else
    		angular.element(document.getElementById('the-ui-view')).css('-webkit-filter','none');
    });
    $scope.reportAppLaunched = function(url) {
    	console.log('URL received');
		var buffer = url.replace('leakstr://','');
		var theArray = buffer.split('?');
		var path = theArray[0];
		var queries = theArray[1].split('=');
		console.log('Path '+path);
		console.log('queries[1]',queries[1]);
		//console.log('Query '+queries[0]+' parameter= '+queries[1]);
		switch(path){
			case 'login':
				//Expecting token, go to leaks
				SocialData.addData(queries[1]);
				console.log('SocialData.getData()');
				console.log(SocialData.getData());
				var buffer = SocialData.getData();
				if(buffer.isRegistered){
					console.log('isRegistered');
					SocialAuth.login(buffer).success(function(data) {
						console.log('LoginSocialController data');
						console.log(data);
						$scope.$emit('loading',false);
						PushNotificationHandler.registerDevice().then(function(data){
							console.log('OK registering device');
							$state.go('leaks');
						},function(error){
							console.log('error PushNotificationHandler.registerDevice()');
							console.log(error);
							$cordovaDialogs.alert('PushNotificationHandler.registerDevice()');
						});
					}).error(function(error){
						console.log('Auth.loginSocial error');
						console.log(error);
						$scope.$emit('loading',false);
						$cordovaDialogs.alert('Error en loginSocial','MainController','OK');
					});
				}else{
					$cordovaDialogs.alert('User is not registered');
				}
			break;
			case 'register':
				SocialData.addData(queries[1]);
				if(SocialData.getData().isRegistered){
					$cordovaDialogs.alert('User is already registered');
				}else{
					$state.go('registerWithSocial');
				}
			break;
		}
	};
	console.groupEnd();
});

myApp.filter('countdown', function() {
	return function(input) {
		var now  = new Date();
		var countdown = input - now.getTime();

		if(countdown<0)
			return '00:00:00:00';

	// the difference timestamp
	var timestamp = input - Date.now();

	timestamp /= 1000; // from ms to seconds

	var component = function (x, v) {
			return Math.floor(x / v);
	};

	var $div = $('div');

	var days    = component(timestamp, 24 * 60 * 60),    // calculate days from timestamp
		hours   = component(timestamp,      60 * 60) % 24, // hours
		minutes = component(timestamp,           60) % 60, // minutes
		seconds = component(timestamp,            1) % 60; // seconds

	var numberFixedLen=	function (n, len) {
						var num = parseInt(n, 10);
						len = parseInt(len, 10);
						if (isNaN(num) || isNaN(len)) {
								return n;
						}
						num = ''+num;
						while (num.length < len) {
								num = '0'+num;
						}
						return num;
		};
		return numberFixedLen(days, 2)+':'+numberFixedLen(hours, 2)+':'+numberFixedLen(minutes, 2)+':'+numberFixedLen(seconds, 2);
	};
}).directive('snapTest', function() {
		return function(scope, element, attrs) {
				var s = Snap(element[0]);
				var nCircles = 5;
				var width = 210;
				var theColor = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
				var theCircles = [];
		var refreshCircles = function(value){
			var timestamp = Date.now()/value;

			if(timestamp<1){
				//console.log(timestamp);
				for(var i = 0; i < nCircles; i++){
					var buffer = s.circle(i*(width+30)/nCircles, 10*timestamp, (width*(1))/nCircles).attr({
						fill: theColor
					});
				}
			}else{
				for(var i = 0; i < nCircles; i++){
					var buffer = s.circle(i*(width+30)/nCircles, 10, (width*(1))/nCircles).attr({
						fill: theColor
					});
				}
			}
		};
		attrs.$observe('snapTest', function(value){
			refreshCircles(value);
		});
				var functionAnimateSize = function(e){
					e.animate({
						r: width*Math.random()
					},functionAnimateSize(e));
				};


		}
	}).filter('numberFixedLen', function () {
				return function (n, len) {
						var num = parseInt(n, 10);
						len = parseInt(len, 10);
						if (isNaN(num) || isNaN(len)) {
								return n;
						}
						num = ''+num;
						while (num.length < len) {
								num = '0'+num;
						}
						return num;
				};
		}).factory('Countdown',function($interval){
			var theArray = [];
			/*var observerCallbacks = [];

			var registerObserverCallback = function(callback){
				observerCallbacks.push(callback);
			};

			var notifyObservers = function(){
				angular.forEach(observerCallbacks, function(callback){
					callback();
				});
			};*/

			var addToCountdown = function(array){
				theArray.push.apply(theArray, array);
			};
			var removeFromCountdown = function(element){
				theArray = theArray.filter(function(theElement){
					return theElement !== element;
				})
			};
			var findByID = function(theID){
				return theArray.filter(function(element){
					return element.id == theID
				});
			};

			$interval(function(){
					if(theArray.length>0){
						for(var i = 0; i<theArray.length; i++){
							if(!theArray[i].processed){
								theArray[i].date -= 1;
							}
						}
					}
				}, 1);

			return {
				add: addToCountdown,
				allLeaks: theArray,
				findByID: findByID,
				remove: removeFromCountdown
			};
		});
myApp.directive("mySrc", function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var img, loadImage, theScope=scope;
      img = null;

      loadImage = function() {
        /*element[0].src = "http://traindaze.com/assets/images/loader.gif";*/
        console.groupCollapsed('mySrc loadImage');
        console.log('element.parent().children(1)',element.parent().children(0));
        angular.element(element.parent().children(0)[0]).css('display','inline-block');
        img = new Image();
        img.src = attrs.mySrc;

        img.onload = function() {
          element[0].src = attrs.mySrc;
          angular.element(element.parent().children(0)[0]).css('display','none');
        };
        console.groupEnd();
      };

      scope.$watch((function() {
        return attrs.mySrc;
      }), function(newVal, oldVal) {
          loadImage();
      });
    }
  };
});
/*myApp.run(function($cordovaStatusbar){
	document.addEventListener('deviceready', function(){
					console.log('document.deviceready');
					$cordovaStatusbar.show(); 
					$cordovaStatusbar.styleDefault();
					$cordovaStatusbar.overlaysWebView(true);
				}, false);
});*/