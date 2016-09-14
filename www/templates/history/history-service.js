angular.module('noochApp.history-service', ['noochApp.services'])
  .service('historyService', function ($http, $localStorage) {

      this.getTransferList = function () {
		  var url = URLs.getTransferList + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId +
		  '&listType=All&pSize=100&pIndex=0&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&SubListType=';
		  console.log(url);
          return $http.get(url);
      };

  })
