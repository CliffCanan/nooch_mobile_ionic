angular.module('noochApp.statistics-service', ['noochApp.services'])
  .service('statisticsService', function ($http, $localStorage) {


    this.GetMemberStatsGeneric = function (queryToSearch) {
      return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken+'&query='+queryToSearch);
    };

      //this.GetMemberStats_Largest_sent_transfer = function () {
      //    return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken+'&query=Largest_sent_transfer');
      //};           
  })
