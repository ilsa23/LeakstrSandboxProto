angular.module('app')
  .controller('FollowController', function($scope,Followers) {
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
  });