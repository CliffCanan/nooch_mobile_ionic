angular.module('noochApp.transferDetails-service', ['noochApp.services'])
  .service('transferDetailsService', function ($http, $localStorage) {
      this.CancelRequest = function (transactionId) {
          return $http.get(URLs.CancelRequest + '?TransactionId=' + transactionId + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);

      };


      this.RemindPayment = function (transactionId) {
          return $http.get(URLs.RemindPayment + '?ReminderType=RequestMoneyReminderToExistingUser&TransactionId=' + transactionId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);

      };

      this.RejectPayment = function (transactionId) {
          return $http.get(URLs.RejectPayment + '?transactionId='+transactionId);

      };

      this.TransferMoney = function (transactionId) {
          var ResTransferPayment = {
              method: 'POST',
              url: URLs.TransferMoney ,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  IsPrePaidTransaction: '',
                  IsPhoneInvitation : '',
                  IsExistingButNonRegUser: '',
                  doNotSendEmails: '',
                  isRentAutoPayment: '',
                  isRentScene: '',
                  Amount: '',
                  TransactionFee: '',
                  TotalRecordsCount: '',
                  TransDate: '',
                  PinNumber: '',
                  MemberId: '',
                  NoochId: '',
                  RecepientId: '',
                  Status: '',
                  TransactionId: '',
                  Name: '',
                  RecepientName: '',
                  Memo: '',
                  TransactionDate: '',
                  DeviceId: '',
                  Latitude: '',
                  Longitude: '',
                  AddressLine1: '',
                  AddressLine2: '',
                  City: '',
                  State: '',
                  Country: '',
                  ZipCode: '',
                  DisputeStatus: '',
                  DisputeId: '',
                  DisputeReportedDate: '',
                  DisputeReviewDate: '',
                  DisputeResolvedDate: '',
                  TransactionType: '',
                  TransactionStatus: '',
                  Photo: '',
                  FirstName: '',
                  LastName: '',
                  SenderPhoto: '',
                  RecepientPhoto: '',
                  synapseTransResult: '',
                  InvitationSentTo: '',
                  PhoneNumberInvited: '',
                  Date: '',
                  Time: '',
                  LocationId: '',
                  Location: '',
                  AdminNotes: '',
                  RaisedBy: '',
                  Picture: '',
                  BankPicture: '',
                  BankAccountId: '',

                  BankId: '',
                  BankName: '',
                  SsnIsVerified: '',
                  cip: ''
              }
          };


          return $http(ResTransferPayment);
      };


  })
