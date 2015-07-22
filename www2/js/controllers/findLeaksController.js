angular.module('app')
  .controller('FindLeaksController', function($scope,Leaks) {
    $scope.foundUsers = {};
    $scope.searchLeak = '';
    $scope.$watch('searchLeak', function() {
      console.log('searching leak: '+$scope.searchLeak);
      if($scope.searchLeak.length>2){
        $scope.$emit('loading',true);
        Leaks.getLeaksByContent($scope.searchLeak).then(function(result){
          $scope.$emit('loading',false);
          $scope.foundLeaks = result.data;
          console.log('result',result.data);
        });
      }else{
        $scope.foundLeaks = {};
      }
    }, true);
  });