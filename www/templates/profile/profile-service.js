angular.module('noochApp.profile-service', ['noochApp.services', 'ngStorage'])
  .service('profileService', function ($http, $localStorage) {
      this.GetMyDetails = function (memberid) {
          return $http.get(URLs.GetMyDetails + '?memberid=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accesstoken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
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
                  Country: Details.Country,
                  Photo: Details.Photo,
                  Picture: Details.Picture
              }
          };         
          return $http(reqForMySettings);
      }


      var Data;
      this.SaveDOBForMember = function (dateOfBirth) {

          console.log('from profile service page');
          console.log(dateOfBirth);

          var reqForSaveDOBForMember = {
              method: 'POST',
              url: URLs.SaveDOBForMember,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  DOB:dateOfBirth,
                 accessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
                 
              }
          };
          return $http(reqForSaveDOBForMember);
      }
  })
