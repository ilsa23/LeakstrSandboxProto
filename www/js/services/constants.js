angular.module('app')
  .constant('AccessLevels', {
    anon: 0,
    user: 1
  })
  .constant('ServerAddress', 'http://leakstrapi.cero.io')