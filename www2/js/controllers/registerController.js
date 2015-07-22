angular.module('app')
  .controller('RegisterController', function($scope, Auth, $cordovaDialogs) {
    $scope.register = function() {
    	console.log("usuario");
    	console.log($scope.user);
      $scope.$emit('loading',true);
      Auth.register($scope.user).success(function(data) {
        //$state.go('anon.home');
        console.log('RegisterController data');
        console.log(data);
        $scope.$emit('loading',false);
        //app.tabbar.setActiveTab(0);
        app.mainnavi.resetToPage('index.html');
      }).error(function(error){
        console.log("error");
        console.log(err);
        $scope.$emit('loading',false);
        $scope.errors.push(err);
        $cordovaDialogs.alert('Error en login','registerController.js','OK');
      });
    }
  });