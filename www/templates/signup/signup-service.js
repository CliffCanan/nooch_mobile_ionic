angular.module('noochApp.signup-service', ['noochApp.services'])
  .service('MemberRegistration', function ($http) {
      
  //    this.Signup = function (signupData) { //this is moved to CreatePinService -Surya

  //        var data = {
  //            UdId: "4c7b35b939a89bca631003d3fec736e",
  //            UserName: signupData.Email,
  //            FirstName: signupData.Name,
  //            LastName: "abc",
  //            PinNumber: "123",
  //            Password: signupData.Password,
  //            SecondaryMail: signupData.Email,
  //            RecoveryMail: signupData.Email,
  //            deviceTokenId: "132",
  //            friendRequestId: "",
  //            invitedFriendFacebookId: "",
  //            facebookAccountLogin: "",
  //            inviteCode: "",
  //            sendEmail: signupData.Email,
  //            type: "Personal"
  //        };
  //        // in case some error occurs

  //        var config = {
  //            headers: {
  //                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
  //            }
  //        }
  //        console.log('data Reached tp SignUp service');
  //        console.log(data);
  //        return $http.post(URLs.Signup, data);
  //    }

  })
