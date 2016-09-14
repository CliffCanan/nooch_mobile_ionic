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
          return $http.get(URLs.GetLocationSearch + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&Radius=20&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      this.CheckMemberExistenceUsingEmailOrPhone = function (CheckType, StringToCheck) {

          //console.log('from profile service page');
          //console.log(Details);

          var reqToCheckExistingUser = {
              method: 'POST',
              url: URLs.CheckMemberExistenceUsingEmailOrPhone,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  CheckType: CheckType,
                  StringToCheck: StringToCheck,
                  AccessToken: $localStorage.GLOBAL_VARIABLES.AccessToken
              }
          };

          return $http(reqToCheckExistingUser);
      }

  })
