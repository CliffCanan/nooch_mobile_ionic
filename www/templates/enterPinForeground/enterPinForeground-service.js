angular.module('noochApp.enterPinForeground-service', ['noochApp.services','ngStorage'])
  .service('ValidatePin', function ($http, $localStorage) {


      //this.MemberPrivacySettings = function (ChkBox) {
     
      this.ValidatePinNumberToEnterForEnterForeground = function (Pin) {
          console.log('From Forground service');
          console.log(Pin);
          return $http.get(URLs.ValidatePinNumberToEnterForEnterForeground + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&pinNo=' + Pin + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };     
  })
