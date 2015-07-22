angular.module('app')
  .controller('MessagesController', function($scope, Messages,$cordovaDatePicker) {
    Messages.getWorld().then(function(result){
      console.log("messagesWorld: ",result.data); 
      $scope.messagesWorld = result.data;
    });
    Messages.getAll().then(function(result) {
      console.log("result.data: ",result.data); 
      $scope.messages = result.data;
    });
    $scope.leak;
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
    $scope.createMessage = function() {
        
        /*console.log("leak");
        console.log($scope.leak);
        $scope.leak.date.setHours($scope.time.getHours());
        $scope.leak.date.setMinutes($scope.time.getMinutes());
        console.log("time: ",$scope.leak.date.getTime());*/
       console.log("Creating Leak: ",$scope.leak);
       Messages.create($scope.leak).then(function(result) {
          $scope.messages = result.data.leaks;
          //$scope.newMessage = '';
          console.log("Leak Response: ");
          console.log(result);
          app.navi.pushPage('templates/user/messages.html');
        });
      
    };

    $scope.deleteMessage = function(message) {
      Messages.remove(message).success(function() {
        var messageIndex = $scope.messages.indexOf(message);
        $scope.messages.splice(messageIndex, 1);
      });
    }
  });