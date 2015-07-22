angular.module('app')
  .config(function($stateProvider, $urlRouterProvider, AccessLevels) {

    $stateProvider
      .state('anon', {
        abstract: true,
        template: '<ui-view/>',
        data: {
          access: AccessLevels.anon
        }
      })
      .state('anon.home', {
        url: '/',
        templateUrl: 'templates/home.html'
      })
      .state('anon.login', {
        url: '/login',
        templateUrl: 'templates/auth/login.html',
        controller: 'LoginController'
      })
      .state('anon.register', {
        url: '/register',
        templateUrl: 'templates/auth/register.html',
        controller: 'RegisterController'
      });

    $stateProvider
      .state('user', {
        abstract: true,
        template: '<ui-view/>',
        data: {
          access: AccessLevels.user
        }
      })
      .state('user.leks', {
        url: '/leaks',
        templateUrl: 'templates/user/leaks.html',
        controller: 'LeaksController'
      });

    $urlRouterProvider.otherwise('/');
  });