angular.module('noochApp.history-service', ['noochApp.services'])
  .service('historyService', function ($http, $localStorage) {

      this.getTransferList = function () {
		  var url = URLs.getTransferList + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId +
		  '&listType=All&pSize=50&pIndex=0&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&SubListType=';
          return $http.get(url);
      };

  })
