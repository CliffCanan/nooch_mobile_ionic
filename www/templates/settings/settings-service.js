angular.module('noochApp.settings-service', ['noochApp.services'])
  .service('settingsService', function ($http) {
      this.logOut = function (accessToken, memberId) {
          return $http.get(URLs.LogOutRequest + '?accessToken=' + accessToken + '&memberId=' + memberId);

      };
     

  })
