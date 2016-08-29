angular.module('noochApp.signup-service', ['noochApp.services'])
  .service('MemberRegistration', function ($http) {
      
      this.GetMemberNameByUserName = function (userName) {
          return $http.get(URLs.GetMemberNameByUserName + '?userName=' + userName);
      }
  })
