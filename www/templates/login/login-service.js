angular.module('noochApp.login-service', ['noochApp.services'])
  .service('authenticationService', function ($http) {

      this.Login = function (username, password, remmberMe, lat, lng, deviceId, deviceToken,deviceType) {
          var url = URLs.Login + '?userName=' + username + '&pwd=' + password + '&rememberMeEnabled=' + remmberMe + '&lat=' + lat + '&lng=' + lng + '&udid=' + deviceId + '&devicetoken=' + deviceToken + "&deviceOS=" + deviceType;
          console.log(url);
          return $http.get(url);
      };

      this.ForgotPassword = function (userName) {

          var data = {
              Input: userName,
              AuthenticationKey: '' // not in use @ server
          };

          return $http.post(URLs.ForgotPassword, data);
      }


      this.LoginWithFacebookGeneric = function (userEmail, FBId, remmberMe, lat, lng, deviceId, deviceToken) {
          return $http.get(URLs.LoginWithFacebookGeneric + '?userEmail=' + userEmail + '&FBId=' + FBId + '&rememberMeEnabled=' + remmberMe + '&lat=' + lat + '&lng=' + lng + '&udid=' + deviceId + '&devicetoken=' + deviceToken);
      };

      this.SaveMembersFBId = function (MemberId, MemberfaceBookId, IsConnect) {
          return $http.get(URLs.SaveMembersFBId + '?MemberId=' + MemberId  + '&MemberfaceBookId=' + MemberfaceBookId + '&IsConnect=' + IsConnect );
      };
  })
