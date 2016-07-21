angular.module('noochApp.securitySetting-service', ['noochApp.services'])
  .service('MemberPrivacy', function ($http, $localStorage) {
      
      
      this.MemberPrivacySettings = function (ChkBox) {
         
          SecurityData = {
              MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
              ShowInSearch: ChkBox.ShowInSearch,
              AllowSharing: "false",
              RequireImmediately: ChkBox.RequirePin
          };

          var config = {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
          }
          console.log('data Reached to MembersPrivacy Setting Services service');
          console.log(SecurityData);
         return $http.post(URLs.MemberPrivacySettings + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken, SecurityData);
      }


  })
