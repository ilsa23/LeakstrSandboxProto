angular.module('app')
  .controller('LoginController', function($scope, Auth, $cordovaDialogs) {
    $scope.errors = [];
    $scope.user = {};
    $scope.login = function() {
      $scope.errors = [];
      console.log("login");
      $scope.$emit('loading',true);
      Auth.login($scope.user).success(function(result) {
        console.log(result);
        $scope.$emit('loading',false);
        app.mainnavi.resetToPage('index.html');
      }).error(function(err) {
        console.log("error");
        console.log(err);
        $scope.$emit('loading',false);
        $scope.errors.push(err);
        $cordovaDialogs.alert('Error en login','loginController.js','OK');
      });
      console.log("login finish");
    }
  });