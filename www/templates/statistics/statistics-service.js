angular.module('noochApp.statistics-service', ['noochApp.services'])
  .service('statisticsService', function ($http, $localStorage) {

      this.GetMemberStatsGeneric = function () {
          return $http.get(URLs.GetMemberStatsGeneric + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      this.GetMostFrequentFriends = function () {
          return $http.get(URLs.GetMostFrequentFriends + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      this.sendTransactionInCSV = function () {
          return $http.post(URLs.sendTransactionInCSV + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&toAddress=' + $localStorage.GLOBAL_VARIABLES.UserName + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };
  })
