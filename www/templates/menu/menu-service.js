angular.module('noochApp.menu-service', ['noochApp.services', 'ngStorage'])
  .service('menuService', function ($http, $localStorage) {

      this.GetUserDetails = function (memberId) {
          var url = URLs.GetUserDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken;
          //console.log("GetUserDetails URL: " + url);
          return $http.get(url);
      };
  })
