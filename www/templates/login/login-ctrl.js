﻿angular.module('noochApp.LoginCtrl', ['noochApp.login-service', 'noochApp.services', 'ngStorage'])

  .controller('LoginCtrl', function ($scope, authenticationService, $state, $ionicLoading, $localStorage, CommonHelper, $cordovaGeolocation, $cordovaDevice,
                                     CommonServices, $cordovaNetwork) {

      $scope.$on("$ionicView.enter", function (event, data) {
          console.log('Login Controller Loaded');
          // swal("Here's a message!");


          if ($localStorage.GLOBAL_VARIABLES)
          {
              console.log($localStorage.GLOBAL_VARIABLES);
              if ($localStorage.GLOBAL_VARIABLES.MemberId)
              {
                  if ($localStorage.GLOBAL_VARIABLES.MemberId.length > 0)
                  {
                      $state.go('app.home');
                  }
              }
          }
          console.log($localStorage.GLOBAL_VARIABLES);
          $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '31.33';
          $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '54.33';
          $localStorage.GLOBAL_VARIABLES.DeviceId = 'UDID123';
          $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NOTIF123';
      });

      $scope.loginData = {
          //email: 'cliff@nooch.com',
          //pwd: 'testing123',

          //email: 'lance@nooch.com',
          //pwd: 'test1234',

          email: 'malkit.singh@venturepact.com',
          pwd: 'Q123456789',

          rmmbrMe: {
              chk: true
          }
      };

      $scope.SignIn = function () {

          //if ($cordovaNetwork.isOnline())
          //{
          function fetchAfterLoginDetails() {
              $ionicLoading.show({
                  template: 'Reading user details...'
              });


              CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName).success(function (data) {
                  $ionicLoading.hide();

                  if (data != null)
                  {
                      $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;
                      $state.go('app.home');
                  }

              }).error(function (err) {
                  $ionicLoading.hide();
              });
          }


          if ($('#frmLogin').parsley().validate() == true)
          {
              $ionicLoading.show({
                  template: 'Logging in...'
              });

              // place checks here for user location
              // notification permission


              CommonServices.GetEncryptedData($scope.loginData.pwd).success(function (data) {

                  authenticationService.Login($scope.loginData.email, data.Status, $scope.loginData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
                    $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
                    .success(function (response) {

                        $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;

                        console.log(response.Result + ', ' + response.Result.indexOf('Temporarily_Blocked'));
                        console.log(response);

                        $ionicLoading.hide();

                        if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1)
                        {
                            swal(response.Result);
                        }
                        else if (response.Result.indexOf('Temporarily_Blocked') > -1)
                        {
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
                                if (isConfirm)
                                {

                                }
                            });
                        }
                        else
                        {
                            $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
                            $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
                            $localStorage.GLOBAL_VARIABLES.Pwd = data.Status;
                            $ionicLoading.hide();
                            // swal("login successfull");

                            fetchAfterLoginDetails();
                            // $state.go("#/app/home"); --not working
                        }
                    }
                    ).error(function (res) {
                        $ionicLoading.hide();
                        console.log('Login Attempt Error: [' + JSON.stringify(res) + ']');
                    });
              }).error(function (encError) {
                  console.log('came in enc error block ' + encError);
              });
          }
          //}
          //else{
          //    swal("Oops...", "Internet not connected!", "error");
          //  }
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

              if (inputValue === "" || inputValue.length == 0)
              {
                  swal.showInputError("Please enter the email address associated with your account.");
                  return false
              }

              if (inputValue.indexOf('@') > 1 &&
                  inputValue.indexOf('.') > inputValue.indexOf('@') &&
                  inputValue.indexOf('.') < inputValue.length - 2)
              {
                  authenticationService.ForgotPassword(inputValue).success(function (data) {
                      console.log(data);

                      if (data.success == true)
                      {
                          swal("Success!", "Input email validated, need to submit to sever here. Input was: [" + inputValue + "]", "success");
                      }
                      else
                      {
                          swal("Error :-(", data.msg, "error");
                      }

                  }).error(function (encError) {
                      console.log('Forgot PW -> Error block ' + encError);
                  });
              }
              else
              {
                  $scope.forgotPw(2)
              }
          });
      }

  })
