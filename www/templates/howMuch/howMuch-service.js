angular.module('noochApp.howMuch-service', ['noochApp.enterPinForeground-service', 'noochApp.services'])
  .service('howMuchService', function ($http, $localStorage) {

     

      this.RequestMoney = function (Data) {
         // Data.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.RequestMoney + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },

              data: Data
          };


          return $http(ResTransferPayment);
      };

      this.TransferMoney = function (Data) {
          console.log(JSON.stringify(Data));
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoney + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },

              data: Data

          };


          return $http(ResTransferPayment);
      };
  })
