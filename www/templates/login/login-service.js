angular.module('noochApp.login-service', ['noochApp.services'])
  .service('authenticationService', function ($http) {

      this.Login = function (username, password, remmberMe, lat, lng, deviceId, deviceToken) {
          return $http.get(URLs.Login + '?userName=' + username + '&pwd=' + password + '&rememberMeEnabled=' + remmberMe + '&lat=' + lat + '&lng=' + lng + '&udid=' + deviceId + '&devicetoken=' + deviceToken);
      };

      this.ForgotPassword = function (userName) {

          var data = {
              Input: userName,
              AuthenticationKey: '' // not in use @ server
          };

          return $http.post(URLs.ForgotPassword, data);
      }


      this.LoginWithFacebook = function (userEmail, FBId, remmberMe, lat, lng, deviceId, deviceToken) {
          return $http.get(URLs.LoginWithFacebook + '?userEmail=' + userEmail + '&FBId=' + FBId + '&rememberMeEnabled=' + remmberMe + '&lat=' + lat + '&lng=' + lng + '&udid=' + deviceId + '&devicetoken=' + deviceToken);
      };
  })
