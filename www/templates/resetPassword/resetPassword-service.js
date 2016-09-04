angular.module('noochApp.resetPasswordService', ['ngStorage'])
  .service('resetPasswordService', function ($http, $localStorage) {

      this.ResetPassword = function (newPassword, newUser) {
          return $http.get(URLs.ResetPassword + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&newPassword=' + newPassword + '&newUser=' + newUser);
      };

      this.ResetPin = function (newPin, oldPin) {
          return $http.get(URLs.ResetPin + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&oldPin=' + oldPin + '&newPin=' + newPin + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      this.validateCurrentPin = function (pinToCheck) {
          var url = URLs.ValidatePinNumber + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&pinNo=' + pinToCheck + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken;
          console.log(url);
          return $http.get(url);
      };

  })
