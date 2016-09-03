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


      // CC (9/1/16): SHOULD JUST SEND DOB WITH THE REGULAR SERVICE FOR SAVING THE REST OF THE PROFILE DATA.
      //              I MADE UPDATES ON THE SERVER FOR THIS, NEED TO PUSH AND TEST AND THEN DELETE THIS.
      //this.SaveDOBForMember = function (dateOfBirth) {
      //    //console.log('Profile Service --> DOB...');
      //    //console.log(dateOfBirth);
      //    var reqForSaveDOBForMember = {
      //        method: 'POST',
      //        url: URLs.SaveDOBForMember,
      //        headers: {
      //            'Content-Type': 'application/json'
      //        },
      //        data: {
      //            MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
      //            DOB: dateOfBirth,
      //            accessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
      //        }
      //    };
      //    return $http(reqForSaveDOBForMember);
      //}


      this.SaveMemberSSN = function (Details) {
          //console.log('Profile Service --> SSN...');
          //console.log(Details);

          var reqForSaveMemberSSN = {
              method: 'POST',
              url: URLs.SaveMemberSSN,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  memberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  SSN: Details.SSN,
                  accessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
              }
          };
          return $http(reqForSaveMemberSSN);
      }

      this.ResendVerificationLink = function () {
          return $http.get(URLs.ResendVerificationLink +
            '?UserName=' + $localStorage.GLOBAL_VARIABLES.UserName);

      };

      this.ResendVerificationSMS = function () {
          return $http.get(URLs.ResendVerificationSMS +
            '?UserName=' + $localStorage.GLOBAL_VARIABLES.UserName);

      };
  })
