angular.module('noochApp.notificationSetting-service', ['noochApp.services'])
  .service('notificationServices', function ($http, $localStorage) {


     this.GetMemberNotificationSettings = function () {
          return $http.get(URLs.GetMemberNotificationSettings + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);

     };

     this.MemberEmailNotificationSettings = function (ChkBox) {
         console.log('getting from servic page');
         console.log(ChkBox);
         var reqForMemberEmailNotificationSettings = {
             method: 'POST',
             url: URLs.MemberEmailNotificationSettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
             headers: {
                 'Content-Type': 'application/json'
             },
             data: {
                 MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                 TransferUnclaimed: '',
                 NoochToBankCompleted: '',
                 EmailTransferSent: '',
                 EmailTransferReceived: '',
                 EmailTransferAttemptFailure: '',
                 BankToNoochRequested: '',
                 BankToNoochCompleted: '',
                 NotificationId: '',
                 NoochToBank: '',
                 BankToNooch: '',
                 TransferReceived: '',
                 TransferSent: '',
                 TransferAttemptFailure: '',
                 FriendRequest: '',
                 InviteRequestAccept: '',
                 EmailFriendRequest: '',
                 EmailInviteRequestAccept: '',
                 NoochToBankRequested: '',
                 InviteReminder: '',
                 LowBalance: '',
                 ValidationRemainder: '',
                 ProductUpdates: '',
                 NewAndUpdate: '',
                 AutomaticWithdrawal: ''
             }
         };
     
         return $http(reqForMemberEmailNotificationSettings);
     }
  })
