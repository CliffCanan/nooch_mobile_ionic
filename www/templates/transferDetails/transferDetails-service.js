angular.module('noochApp.transferDetails-service', ['noochApp.services'])
  .service('transferDetailsService', function ($http, $localStorage) {
      this.CancelRequest = function (transactionId) {
          return $http.get(URLs.CancelRequest + '?TransactionId=' + transactionId + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);
      };

      this.RemindPayment = function (transactionId) {
          return $http.get(URLs.RemindPayment + '?ReminderType=RequestMoneyReminderToExistingUser&TransactionId=' + transactionId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId);
      };

      this.RejectPayment = function (transactionId) {
          return $http.get(URLs.RejectPayment + '?transactionId=' + transactionId);
      };

      //this.TransferMoney = function (IsPrePaidTransaction, IsPhoneInvitation, IsExistingButNonRegUser, doNotSendEmails, isRentAutoPayment, isRentScene, Amount, TransactionFee, TotalRecordsCount, TransDate, PinNumber, MemberId, NoochId, RecepientId, Status, TransactionId, Name, RecepientName, Memo, TransactionDate, DeviceId, Latitude, Longitude, AddressLine1, AddressLine2, City, State, Country, ZipCode, DisputeStatus, DisputeId, DisputeReportedDate, DisputeReviewDate, DisputeResolvedDate, TransactionType, TransactionStatus, Photo, FirstName, LastName, SenderPhoto, RecepientPhoto, synapseTransResult, InvitationSentTo, PhoneNumberInvited, Date, Time, LocationId, Location, AdminNotes, RaisedBy, Picture, BankPicture, BankAccountId, BankId, BankName, SsnIsVerified,cip) {
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

  })