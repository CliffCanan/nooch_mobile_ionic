angular.module('noochApp.LoginCtrl', ['noochApp.services'])


/***************/
/***  LOGIN  ***/
/***************/
 .controller('LoginCtrl', function ($scope, authenticationService, $state, $ionicLoading) {

     $scope.$on("$ionicView.enter", function (event, data) {
         console.log('Login Controller loaded');
         // swal("Here's a message!");
     });

     $scope.loginData = {
         email: '',
         pwd: '',
         rmmbrMe: {
             val: true
         }
     };

     $scope.SignIn = function () {
         if ($('#frmLogin').parsley().validate() == true) {
             $ionicLoading.show({
                 template: 'Loading...'
             });

             username = $scope.loginData.email;
             pwd = $scope.loginData.pwd;
             remmbrMe = $scope.loginData.rmmbrMe.val;

             authenticationService.Login(username, pwd, remmbrMe, function (response) {

                 $scope.loginData.email = '';
                 $scope.loginData.pwd = '';
                 $scope.loginData.rmmbrMe.val = false;

                 console.log(response.Result + ',' + response.Result.indexOf('Temporarily_Blocked'));
                 console.log(response);

                 if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1) {
                     $ionicLoading.hide();
                     swal(response.Result);
                 }
                 else if (response.Result.indexOf('Temporarily_Blocked') > -1) {
                     $ionicLoading.hide();
                     swal({
                         title: "Oh No!",
                         text: "To keep Nooch safe your account has been temporarily suspended because you entered an incorrect passwod too many times.<br><br> In most cases your account will be automatically un-suspended in 24 hours. you can always contact support if this is an error.<br><br> We really apologize for the inconvenience and ask for your patience. Our top priority is keeping Nooch safe and secure.",
                         type: "error",
                         showCancelButton: true,
                         cancelButtonText: "Ok",
                         confirmButtonColor: "#3fabe1",
                         confirmButtonText: "Contact Support",
                         customClass: "stackedBtns",
                         html: true,
                     }, function (isConfirm) {
                         if (isConfirm) {

                         }
                     });
                 }
                 else {
                     $ionicLoading.hide();
                     swal("login successfull");
                     // $state.go("#/app/home"); --not working
                 }
             });
         }
     }

     $scope.forgotPw = function (type) {

         var msgTxt = type == 1 ? "Please enter your email and we will send you a reset link." : "Please make sure you entered a valid email address.";

         swal({
             title: "Forgot Password",
             text: msgTxt,
             type: "input",
             inputPlaceholder: "Email Address",
             showCancelButton: true,
             cancelButtonText: "Cancel",
             confirmButtonColor: "#3fabe1",
             confirmButtonText: "Submit",
             closeOnConfirm: false,
             html: true,
         }, function (inputValue) {
             if (inputValue === false) return false;

             if (inputValue === "" || inputValue.length == 0) {
                 swal.showInputError("Please enter the email address associated with your account.");
                 return false
             }

             if (inputValue.indexOf('@') > 1 &&
                 inputValue.indexOf('.') > inputValue.indexOf('@') &&
                 inputValue.indexOf('.') < inputValue.length - 2) {
                 swal("Success!", "Input email validated, need to submit to sever here. Input was: [" + inputValue + "]", "success");
             }
             else {
                 $scope.forgotPw(2)
             }
         });
     }

 })