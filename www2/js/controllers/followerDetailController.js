angular.module('app')
  .controller('FollowerDetailController', function($scope, Leaks, $cordovaDialogs) {
  		console.log("app.navi.getCurrentPage().options.id",app.navi.getCurrentPage().options.id);
  		$scope.selectedLeak = {};
  		$scope.theuser = app.mainnavi.getCurrentPage().options;
  		Leaks.getLeaksByUser(app.mainnavi.getCurrentPage().options.id).then(function(leaksFromUser){
  			console.log("leaksFromUser");
  			console.log(leaksFromUser);
  			$scope.leaksWorldFromUser = leaksFromUser.data;
  		});
  		$scope.followUser = function(){
		  $cordovaDialogs.confirm('Quieres seguir a este Usuario?', '', ['OK','Cancelar'])
		    .then(function(buttonIndex) {
		      // no button = 0, 'OK' = 1, 'Cancel' = 2
		      if(buttonIndex==1){
		      	$scope.$emit('loading',true);
		      	Leaks.followUser($scope.theuser.id).success(function(data){
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
  		$scope.followUserDesktop = function(){
			Leaks.followUser($scope.theuser.id).success(function(data){
				console.log('follow leak success:',data);
				$scope.$emit('loading',false);
			}).error(function(error){
				console.log('follow leak error:',error);
				$scope.$emit('loading',false);
			});  			
  		};
  });