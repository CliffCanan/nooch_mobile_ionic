angular.module('noochApp.transferDetails-service', ['noochApp.services'])
  .service('transferDetailsService', function ($http, $localStorage) {
      this.CancelRequest = function (transactionId) {
          return $http.get(URLs.CancelRequest + '?TransactionId=' + transactionId + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);

      };


      this.RemindPayment = function (transactionId) {
          return $http.get(URLs.RemindPayment + '?ReminderType=RequestMoneyReminderToExistingUser&TransactionId=' + transactionId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);

      };


  })
