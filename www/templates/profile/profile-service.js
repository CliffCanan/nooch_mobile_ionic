angular.module('noochApp.profile-service', ['noochApp.services', 'ngStorage'])
  .service('profileService', function ($http, $localStorage) {
      this.GetMyDetails = function (memberId) {
          return $http.get(URLs.GetMyDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);

      };
      var data;
      this.MySettings = function (Details) {

          //console.log('from profile service page');
          //console.log(Details);

          var reqForMySettings = {
              method: 'POST',
              url: URLs.MySettings + '?accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  UserName: Details.UserName,
                  FirstName: Details.FirstName,
                  LastName: Details.LastName,
                  Password: $localStorage.GLOBAL_VARIABLES.Pwd,
                  ContactNumber: Details.ContactNumber,
                  Address: Details.Address,
                  State: Details.State,
                  City: Details.City,
                  Zipcode: Details.Zip,
                  Country: Details.Country
              }
          };             
          return $http(reqForMySettings);
      }
  })
