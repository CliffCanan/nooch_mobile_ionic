angular.module('noochApp.menu-service', ['noochApp.services', 'ngStorage'])
  .service('menuService', function ($http, $localStorage) {

      this.GetUserDetails = function (memberId) {
          return $http.get(URLs.GetUserDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };
  })
