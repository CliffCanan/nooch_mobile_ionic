angular.module('noochApp.history-service', ['noochApp.services'])
  .service('historyService', function ($http, $localStorage) {

      this.getTransferList = function () {
          return $http.get(URLs.getTransferList +
            '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId +
            '&listType=ALL&pSize=100&pIndex=0&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&SubListType=');

      };


  })
