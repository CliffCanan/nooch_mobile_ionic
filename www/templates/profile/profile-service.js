angular.module('noochApp.profile-service', ['noochApp.services', 'ngStorage'])
  .service('profileService', function ($http, $localStorage) {

      this.GetMyDetails = function (memberid) {
          return $http.get(URLs.GetMyDetails + '?memberid=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accesstoken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      };

      var data;

      this.UpdateProfile = function (Details) {

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
                  ContactNumber: Details.ContactNumber,
                  Address: Details.Address,
                  Address2: Details.Address2,
                  State: Details.State,
                  City: Details.City,
                  Zipcode: Details.Zipcode,
                  Country: Details.Country,
                  DateOfBirth: Details.DateOfBirth,
                  Photo: Details.Photos,
                  Password: $localStorage.GLOBAL_VARIABLES.Pwd
              }
          };
          return $http(reqForMySettings);
      }


      this.SaveMemberSSN = function (ssn) {
          //console.log('Profile Service --> SSN...');

          var reqForSaveMemberSSN = {
              method: 'POST',
              url: URLs.SaveMemberSSN,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  memberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  SSN: ssn,
                  accessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
              }
          };
          return $http(reqForSaveMemberSSN);
      }
  })
