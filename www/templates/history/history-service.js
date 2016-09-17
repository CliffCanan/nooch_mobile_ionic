angular.module('noochApp.history-service', ['noochApp.services'])
  .service('historyService', function ($http, $localStorage) {

      this.getTransferList = function (SubListType) {
          console.log(SubListType);
		  var url = URLs.getTransferList + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId +
		  '&listType=All&pSize=60&pIndex=0&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&SubListType=' + SubListType;
          return $http.get(url);
      };

  })
