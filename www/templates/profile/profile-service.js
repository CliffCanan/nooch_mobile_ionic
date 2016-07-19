angular.module('noochApp.profile-service', ['ngStorage'])
  .service('profileService', function ($http,$localStorage) {
    this.GetMyDetails = function (memberId) {
      return $http.get(URLs.GetMyDetails + '?memberId=' + memberId + '&accessToken=' +  $localStorage.GLOBAL_VARIABLES.AccessToken);

    };


  })
