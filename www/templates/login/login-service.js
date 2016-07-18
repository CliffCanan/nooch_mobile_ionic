angular.module('noochApp.login-service', ['noochApp.services'])
  .service('authenticationService', function ($http) {
    this.Login = function (username, password, remmberMe, lat, lng, deviceId, deviceToken) {
      return $http.get(URLs.Login + '?userName=' + username + '&pwd=' + password + '&rememberMeEnabled=' + remmberMe + '&lat=' + lat + '&lng=' + lng + '&udid=' + deviceId + '&devicetoken=' + deviceToken);

    };

  })
