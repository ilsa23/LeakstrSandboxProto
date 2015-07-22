angular.module('app')
  .controller('DetailController', function($scope, Leaks, $cordovaDialogs) {
  		console.log("app.navi.getCurrentPage().options.id",app.navi.getCurrentPage().options.id);
  		$scope.selectedLeak = {};
  		$scope.comment = '';
  		Leaks.getLeak(app.mainnavi.getCurrentPage().options.id).then(function(leakData){
  			console.log("leakData");
  			console.log(leakData.data);
  			$scope.selectedLeak = leakData.data;
			(function (localScope) {
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
			})($scope);
  		});
  		Leaks.getComments(app.mainnavi.getCurrentPage().options.id).then(function(allComments){
  			$scope.allComments = allComments.data;
  			console.log('allComments',allComments.data);
  		});
  		$scope.follow = function(){
		  $cordovaDialogs.confirm('Quieres seguir este Leak?', '', ['OK','Cancelar'])
		    .then(function(buttonIndex) {
		      // no button = 0, 'OK' = 1, 'Cancel' = 2
		      if(buttonIndex==1){
		      	$scope.$emit('loading',true);
		      	Leaks.followLeak($scope.selectedLeak.id).success(function(data){
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
  		$scope.sendComment = function(){
  			Leaks.setComment($scope.comment,app.mainnavi.getCurrentPage().options.id).then(function(data){
  				console.log(data);
  			});
  		};
  });