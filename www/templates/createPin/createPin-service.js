angular.module('noochApp.createPin-service', ['noochApp.services', 'ngStorage'])

  .service('createPinServices', function ($http, $localStorage) {
   
      this.Signup = function (signUpData) {
             
              var data = {
                  UdId: $localStorage.GLOBAL_VARIABLES.DeviceId,
                  Photo: signUpData.Photo != "" ? signUpData.Photo : null,
                  UserName: signUpData.Email,
                  FirstName: signUpData.Name,
                  LastName: signUpData.Name, 
                  PinNumber: signUpData.Pin,
                  Password: signUpData.Password,
                  SecondaryMail: signUpData.Email,
                  RecoveryMail: signUpData.Email,
                  deviceTokenId: $localStorage.GLOBAL_VARIABLES.DeviceToken,
                  friendRequestId: "",
                  invitedFriendFacebookId: "",
                  facebookAccountLogin: "",
                  inviteCode: "",
                  sendEmail: "true",
                  type: "Personal"
              };
              // in case some error occurs

              var config = {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                  }
              }
              console.log('SignUp Data to send to server...');
              console.log(data);
              return $http.post(URLs.Signup, data);
          }
      })