angular.module('noochApp.menu-service', ['noochApp.services', 'ngStorage'])
  .service('menuService', function ($http, $localStorage) {
      this.GetMemberDetails = function (memberId) {
          return $http.get(URLs.GetMemberDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);

      };

  })
