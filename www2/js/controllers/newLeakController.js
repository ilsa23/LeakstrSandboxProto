angular.module('app')
  .controller('NewLeakController', function($scope, Leaks,$cordovaDatePicker) {
    $scope.leak = {};
    $scope.miDatePicker = function(){
      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        doneButtonLabel: 'OK',
        cancelButtonLabel: 'Cancelar',
        doneButtonColor: '#336ac0'
      };
      $cordovaDatePicker.show(options).then(function(date){
          
          $scope.leak.date = date.getTime();

      });    
    };
    $scope.createLeak = function() {
       $scope.$emit('loading',true);
       console.log("Creating Leak: ",$scope.leak);
       (function(localScope){
          Leaks.create($scope.leak).then(function(result) {
            $scope.$emit('loading',false);
            console.log("Leak Response: ");
            console.log(result);
            localScope.leaksWorld = {};
            localScope.$apply();
            app.mainnavi.popPage();
          });          
       })($scope);
    };
  });