angular.module('noochApp.createPin-service', ['noochApp.services', 'ngStorage'])

  .service('createPinServices', function ($http, $localStorage) {
   
          this.Signup = function (signupData) {
             
              var data = {
                  UdId: "4c7b35b939a89bca631003d3fec736e",
                  Photo: signupData.Photo != null ? signupData.Photo : null,
                  UserName: signupData.Email,
                  FirstName: signupData.Name,
                  LastName: '',
                  PinNumber: signupData.Pin,
                  Password: signupData.Password,
                  SecondaryMail: signupData.Email,
                  RecoveryMail: signupData.Email,
                  deviceTokenId: "132",
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