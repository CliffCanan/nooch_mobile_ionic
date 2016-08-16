angular.module('noochApp.enterPin-service', ['noochApp.enterPinForeground-service', 'noochApp.services'])
  .service('enterPinService', function ($http, $localStorage) {
      this.TransferMoney = function (Data) {
          console.log(Data);
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
      this.TransferMoneyToNonNoochUserUsingSynapse = function (Data) {
          console.log(Data);
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoneyToNonNoochUserUsingSynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&inviteType=Email&' + 'receiverEmailId=' + Data.InvitationSentTo,
              headers: {
                  'Content-Type': 'application/json'
              },
              //data: {
              //    IsPrePaidTransaction: '',
              //    IsPhoneInvitation : '',
              //    IsExistingButNonRegUser: '',
              //    doNotSendEmails: '',
              //    isRentAutoPayment: '',
              //    isRentScene: '',
              //    Amount: '',
              //    TransactionFee: '',
              //    TotalRecordsCount: '',
              //    TransDate: '',
              //    PinNumber: '',
              //    MemberId: '',
              //    NoochId: '',
              //    RecepientId: '',
              //    Status: '',
              //    TransactionId: transactionId,
              //    Name: '',
              //    RecepientName: '',
              //    Memo: '',
              //    TransactionDate: '',
              //    DeviceId: '',
              //    Latitude: '',
              //    Longitude: '',
              //    AddressLine1: '',
              //    AddressLine2: '',
              //    City: '',
              //    State: '',
              //    Country: '',
              //    ZipCode: '',
              //    DisputeStatus: '',
              //    DisputeId: '',
              //    DisputeReportedDate: '',
              //    DisputeReviewDate: '',
              //    DisputeResolvedDate: '',
              //    TransactionType: '',
              //    TransactionStatus: '',
              //    Photo: '',
              //    FirstName: '',
              //    LastName: '',
              //    SenderPhoto: '',
              //    RecepientPhoto: '',
              //    synapseTransResult: '',
              //    InvitationSentTo: '',
              //    PhoneNumberInvited: '',
              //    Date: '',
              //    Time: '',
              //    LocationId: '',
              //    Location: '',
              //    AdminNotes: '',
              //    RaisedBy: '',
              //    Picture: '',
              //    BankPicture: '',
              //    BankAccountId: '',

              //    BankId: '',
              //    BankName: '',
              //    SsnIsVerified: '',
              //    cip: ''
              //}
              data: Data

          };


          return $http(ResTransferPayment);
      };

      this.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse = function (Data) {
          console.log(Data);
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoneyToNonNoochUserThroughPhoneUsingsynapse + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&inviteType=email&receiverPhoneNumer=' + Data.PhoneNumberInvited,

              headers: {
                  'Content-Type': 'application/json'
              },
              //data: {
              //    IsPrePaidTransaction: '',
              //    IsPhoneInvitation : '',
              //    IsExistingButNonRegUser: '',
              //    doNotSendEmails: '',
              //    isRentAutoPayment: '',
              //    isRentScene: '',
              //    Amount: '',
              //    TransactionFee: '',
              //    TotalRecordsCount: '',
              //    TransDate: '',
              //    PinNumber: '',
              //    MemberId: '',
              //    NoochId: '',
              //    RecepientId: '',
              //    Status: '',
              //    TransactionId: transactionId,
              //    Name: '',
              //    RecepientName: '',
              //    Memo: '',
              //    TransactionDate: '',
              //    DeviceId: '',
              //    Latitude: '',
              //    Longitude: '',
              //    AddressLine1: '',
              //    AddressLine2: '',
              //    City: '',
              //    State: '',
              //    Country: '',
              //    ZipCode: '',
              //    DisputeStatus: '',
              //    DisputeId: '',
              //    DisputeReportedDate: '',
              //    DisputeReviewDate: '',
              //    DisputeResolvedDate: '',
              //    TransactionType: '',
              //    TransactionStatus: '',
              //    Photo: '',
              //    FirstName: '',
              //    LastName: '',
              //    SenderPhoto: '',
              //    RecepientPhoto: '',
              //    synapseTransResult: '',
              //    InvitationSentTo: '',
              //    PhoneNumberInvited: '',
              //    Date: '',
              //    Time: '',
              //    LocationId: '',
              //    Location: '',
              //    AdminNotes: '',
              //    RaisedBy: '',
              //    Picture: '',
              //    BankPicture: '',
              //    BankAccountId: '',

              //    BankId: '',
              //    BankName: '',
              //    SsnIsVerified: '',
              //    cip: ''
              //}
              data: Data

          };


          return $http(ResTransferPayment);
      };

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

      this.RequestMoneyToNonNoochUserThroughPhoneUsingSynapse = function (Data, contactNum) {
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

  })