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
        // in case some rror occurs

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        // return $http.post(URLs.ForgotPassword, data,config);
        return $http.post(URLs.ForgotPassword, data);
      //  return $.post(URLs.ForgotPassword, data);

    }

  })
