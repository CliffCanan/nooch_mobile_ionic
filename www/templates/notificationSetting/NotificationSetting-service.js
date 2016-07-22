angular.module('noochApp.notificationSetting-service', ['noochApp.services'])
  .service('notificationServices', function ($http, $localStorage) {


     this.GetMemberNotificationSettings = function () {
          return $http.get(URLs.GetMemberNotificationSettings + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);

      };
  })
