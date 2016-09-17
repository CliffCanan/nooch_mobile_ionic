angular.module('noochApp.securitySetting-service', ['noochApp.services'])
  .service('MemberPrivacy', function ($http, $localStorage, $rootScope) {

      this.UpdateSecuritySettings = function (newSettings) {
          console.log('isRequiredImmediately ROOTSCOPE: [' + $rootScope.isRequiredImmediately + '], showInSearch: [' + $rootScope.showInSearch + ']');
          console.log('isRequiredImmediately newSettings: [' + newSettings.isRequiredImmediately + '], showInSearch: [' + newSettings.showInSearch + ']');

          var reqForMemberSettings = {
              method: 'POST',
              url: URLs.MemberPrivacySettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  ShowInSearch: newSettings.showInSearch,
                  AllowSharing: "false",
                  RequireImmediately: newSettings.isRequiredImmediately
              }
          };

          return $http(reqForMemberSettings);
      }
  })
