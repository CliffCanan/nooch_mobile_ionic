angular.module('noochApp.selectRecipientService', ['ngStorage'])
  .service('selectRecipientService', function ($http, $localStorage) {
      this.MemberEmailNotificationSettings = function (MemberNotifications) {

          var postData = {

              // All required data, this are must haves
              MemberId: MemberNotifications.MemberId,
              EmailTransferSent: MemberNotifications.EmailTransferSent,
              EmailTransferReceived: MemberNotifications.EmailTransferReceived,
              EmailTransferAttemptFailure: MemberNotifications.EmailTransferAttemptFailure,


              // Malkit (19 July 2016) not in use but must pass to match expected input parameters - Will remove these once input model @ server gets modified
              TransferUnclaimed: '',
              BankToNoochRequested: '',
              BankToNoochCompleted: '',
              NoochToBankRequested: '',
              NoochToBankCompleted: '',
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
              InviteReminder: '',
              LowBalance: '',
              ValidationRemainder: '',
              ProductUpdates: '',
              NewAndUpdate: '',
              AutomaticWithdrawal: ''
          };

          return $http.post(URLs.MemberEmailNotificationSettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken, data);
      };

      this.GetRecentMembers = function () {
          return $http.get(URLs.GetRecentMembers + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      this.GetLocationSearch = function () {
          return $http.get(URLs.GetLocationSearch + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&Radius=100&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

  })
