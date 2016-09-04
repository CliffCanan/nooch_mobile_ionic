angular.module('noochApp.settings-service', ['noochApp.services'])
  .service('settingsService', function ($http, $localStorage) {

      this.logOut = function (accessToken, memberId) {
          return $http.get(URLs.LogOutRequest + '?accessToken=' + accessToken + '&memberId=' + memberId);
      };

      this.GetSynapseBankAndUserDetails = function () {
          return $http.get(URLs.GetSynapseBankAndUserDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);
      };

      this.DeleteAttachedBankNode = function () {
          return $http.get(URLs.DeleteAttachedBankNode + '?memberid=' + $localStorage.GLOBAL_VARIABLES.MemberId);
      };

  })
