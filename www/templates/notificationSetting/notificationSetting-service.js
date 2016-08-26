angular.module('noochApp.notificationSetting-service', ['noochApp.services'])
  .service('notificationServices', function ($http, $localStorage) {


     this.GetMemberNotificationSettings = function () {
          return $http.get(URLs.GetMemberNotificationSettings + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);

     };

     this.MemberEmailNotificationSettings = function (ChkBox) {
         //console.log('getting from servic page');
         //console.log(ChkBox);

         var reqForMemberEmailNotificationSettings = {
             method: 'POST',
             url: URLs.MemberEmailNotificationSettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
             headers: {
                 'Content-Type': 'application/json'
             },
             data: {
                 MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                 TransferUnclaimed: (ChkBox.TransUnclaimed==true)?'1':'0',
                 NoochToBankCompleted: '',
                 EmailTransferSent: (ChkBox.EmailTransferSent == true) ? '1' : '0',
                 EmailTransferReceived: (ChkBox.EmailTransferReceived == true) ? '1' : '0',
                 EmailTransferAttemptFailure: '',
                 BankToNoochRequested: '',
                 BankToNoochCompleted: '',
                 NotificationId: 123456,
                 NoochToBank: '',
                 BankToNooch: '',               
                 TransferReceived: (ChkBox.TransferReceived == true) ? '1' : '0',
                 TransferSent:'',
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
