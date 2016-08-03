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

      this.RequestMoneyToNonNoochUserUsingSynapse = function (Data) {
          // Data.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.RequestMoneyToNonNoochUserUsingSynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },

              data: Data
          };


          return $http(ResTransferPayment);
      };

      this.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse = function (Data,contactNum) {
          // Data.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&PayorPhoneNumber=' + contactNum,
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
      this.TransferMoneyToNonNoochUserUsingSynapse = function (Data, receiverEmailId) {
          console.log(JSON.stringify(Data));
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoneyToNonNoochUserUsingSynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&inviteType=email&receiverEmailId=' + receiverEmailId,
              headers: {
                  'Content-Type': 'application/json'
              },

              data: Data

          };


          return $http(ResTransferPayment);
      };

      this.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse = function (Data, receiverPhoneNumer) {
          console.log(JSON.stringify(Data));
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&inviteType=email&receiverPhoneNumer=' + receiverPhoneNumer,
              headers: {
                  'Content-Type': 'application/json'
              },

              data: Data

          };


          return $http(ResTransferPayment);
      };
  })
