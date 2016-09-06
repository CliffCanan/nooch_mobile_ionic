angular.module('noochApp.securitySetting-service', ['noochApp.services'])
  .service('MemberPrivacy', function ($http, $localStorage) {

      this.UpdateSecuritySettings = function (ChkBox) {

          var reqForMemberSettings = {
              method: 'POST',
              url: URLs.MemberPrivacySettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  ShowInSearch: ChkBox.ShowInSearch,
                  AllowSharing: "false",
                  RequireImmediately: ChkBox.RequireImmediately
              }
          };

          return $http(reqForMemberSettings);
      }


      this.GetMemberPrivacySettings = function () {
          var url = URLs.GetMemberPrivacySettings + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken;
          console.log(url);
          return $http.get(url);
      };
  })
