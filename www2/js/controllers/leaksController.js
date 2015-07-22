angular.module('app')
  .controller('LeaksController', function($scope, Leaks,$cordovaDatePicker, $rootScope, PushNotificationHandler,Auth) {
    console.log("LeaksController!");
    $scope.leak = {};
    $scope.leaksWorld = {};
    $scope.leaks = {};  
    $scope.logoutme = function(){
      Auth.logout();
      app.mainnavi.pushPage('templates/auth/registerOrLogin.html');
    };
    $scope.refresh = function(){
      $scope.$emit('loading',true);
      Leaks.getWorld().then(function(result){
        $scope.$emit('loading',false);
        console.log("leaksWorld: ",result.data); 
        $scope.leaksWorld = result.data;
      });
      /*Leaks.getFeed().then(function(result) {
        $scope.$emit('loading',false);
        console.log("result.data: ",result.data); 
        $scope.leaksWorld = result.data;
      });*/
      Leaks.getAll().then(function(result) {
        $scope.$emit('loading',false);
        console.log("result.data: ",result.data); 
        $scope.leaks = result.data;
      });      
    };
    document.addEventListener('resume', function(){
      console.log('document.resume');
     $scope.refresh(); 
    }, false);
    document.addEventListener('pause', function(){
      console.log('document.pause');
    }, false);
    document.addEventListener('deviceready', function(){
      console.log('document.deviceready');
    }, false);

    app.mainnavi.on('postpop', function(event) {
        var page = event.currentPage; // Get current page object
        if (false) {
          event.cancel(); // Cancel operation
        }
        console.log('postpop');
        console.log(page);
        $scope.refresh();
        $scope.$apply();
      });

    $scope.localnavi ="localtext";
    /*$scope.deleteLeak = function(leak) {
      Leaks.remove(leak).success(function() {
        var leakIndex = $scope.leaks.indexOf(leak);
        $scope.leaks.splice(leakIndex, 1);
      });
    }*/

    $rootScope.$on('testing',function(event,notification){
      console.log('testing event!');
      console.log(event);
      console.log('testing notification!');
      console.log(notification);
      console.log('test local: '+ $scope.localnavi);
      console.log('notification.leakID: '+notification.leakID);
      event.targetScope.app.navi.pushPage('templates/user/leakDetail.html',{id:notification.leakID});
    });
    
    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      console.log('testing event!');
      console.log(event);
      console.log('testing notification!');
      console.log(notification);
      console.log('test local: '+ $scope.localnavi);
      console.log('notification.leakID: '+notification.leakID);
      app.tabbar.setActiveTab(0);
      if(event.targetScope.app.mainnavi.getCurrentPage().options.id != notification.leakID){
      event.targetScope.app.mainnavi.pushPage('templates/user/leakDetail.html',
                                          {
                                            id:notification.leakID
                                          });
      } 
      console.log('finish');
    });
    
    (function (localScope) {
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
    })($scope); 

    $scope.call = function(leak){
      console.log('miauuu: '+leak);
    }
    $scope.refresh();
  });