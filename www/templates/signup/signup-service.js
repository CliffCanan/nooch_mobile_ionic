angular.module('noochApp.signup-service', ['noochApp.services'])
  .service('MemberRegistration', function ($http) {
      
      this.CheckIfEmailIsRegistered = function (userName) {
          return $http.get(URLs.CheckIfEmailIsRegistered + '?userName=' + userName);
      }
  })
