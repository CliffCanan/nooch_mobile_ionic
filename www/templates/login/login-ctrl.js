angular.module('noochApp.LoginCtrl', ['noochApp.login-service', 'noochApp.services', 'ngStorage'])

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicLoading, $localStorage, $cordovaGeolocation, $cordovaDevice,
	  								 $cordovaNetwork, $cordovaSocialSharing, $timeout, CommonHelper, authenticationService, CommonServices, $cordovaGoogleAnalytics) {

      $scope.$on("$ionicView.beforeEnter", function (event, data) {
          console.log('Login Controller Loaded');

          $scope.loginData = {
              email: '',
              pwd: '',
              rmmbrMe: {
                  chk: true
              }
          };

          if ($localStorage.GLOBAL_VARIABLES)
          {
              if ($localStorage.GLOBAL_VARIABLES.MemberId != null &&
				  $localStorage.GLOBAL_VARIABLES.MemberId.length > 0 &&
				  $localStorage.GLOBAL_VARIABLES.AccessToken != null &&
				  $localStorage.GLOBAL_VARIABLES.AccessToken.length > 0)
              {
                  $state.go('app.home');
              }
              else
              {
                  $scope.loginData.rmmbrMe.chk = $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled == false ? false : true;
                  $scope.loginData.email = $localStorage.GLOBAL_VARIABLES.UserName;

                  if ($('#toLoginBtn').hasClass('bounceOutRight'))
                      $('#toLoginBtn').removeClass('bounceOutRight');
              }
          }

          //console.log($scope.loginData);
      });

      $scope.$on("$ionicView.enter", function (event, data) {
          $ionicPlatform.ready(function () {
              if (typeof analytics !== 'undefined') analytics.trackView("Login");
          })
      });


      $scope.loginWithFbData = {
          Name: '',
          Email: '',
          Password: '',
          Photo: '',
          Pin: '',
          rmmbrMe: {
              chk: $rootScope.isRequiredImmediately == false ? false : true
          },
          FBId: '',
          fbStatus: ''
      };


      $scope.isConnectedToFb = false;


      $scope.SignIn = function () {

          //if ($cordovaNetwork.isOnline())
          //{
          if ($('#frmLogin').parsley().validate() == true)
          {
              $ionicPlatform.ready(function () {
                  $ionicLoading.show({
                      template: 'Logging in...'
                  });

                  if (window.cordova)
                  {
                      cordova.plugins.diagnostic.isLocationAuthorized(function (enabled) {
                          if (enabled == true)
                          {
                              $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = true;
                              $scope.checkGpsStatus();
                          }
                          else
                          {
                              // User has not yet authorized location access - so just login (we request permission later only at a relevant time, i.e. on Select Recipient -> Search By Location Tab)
                              $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                              //$localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '0.00';
                              //$localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '0.00';

                              $scope.loginService();
                          }
                      }, function (error) {
                          $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                          console.error("Login -> isLocationAuthorized Error: [" + JSON.stringify(error) + ']');
                      });
                  }
                  else // for Browser testing
                      $scope.loginService();
              });
          }
          //} else
          //    swal("Error", "Internet not connected!", "error");
      }


      $scope.loginService = function () {
          CommonServices.GetEncryptedData($scope.loginData.pwd).success(function (data) {

              console.log($localStorage.GLOBAL_VARIABLES);
              $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled = $scope.loginData.rmmbrMe.chk;

              authenticationService.Login($scope.loginData.email, data.Status, $scope.loginData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
                $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken, $localStorage.GLOBAL_VARIABLES.DeviceOS)
                .success(function (response) {

                    $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;

                    //console.log(response);

                    if (response != null && response.Result != null)
                    {
                        if (response.Result.indexOf('Invalid user id') > -1)
                        {
                            $ionicLoading.hide();
                            swal({
                                title: "Invalid Email or Password",
                                text: "We don't recognize that information. &nbsp;Please double check that your email and password are entered correctly and try again.",
                                type: "error",
                                customClass: "singleBtn",
                                html: true
                            });
                        }
                        else if (response.Result.indexOf('incorrect') > -1)
                        {
                            $ionicLoading.hide();
                            swal({
                                title: "This is Awkward",
                                text: "That doesn't appear to be the correct password. &nbsp;Please try again or contact us for further help.",
                                type: "error",
                                showCancelButton: true,
                                cancelButtonText: "Ok",
                                confirmButtonText: "Contact Support",
                                html: true
                            }, function (isConfirm) {
                                if (isConfirm)
                                {
                                    $cordovaSocialSharing
                                      .shareViaEmail('', 'Nooch Support Request - Login Trouble', 'support@nooch.com', null, null, null)
                                      .then(function (res) {
                                      }, function (err) {
                                          console.log('Error attempting to send email from social sharing: [' + JSON.stringify(err) + ']');
                                      });
                                }
                            });
                        }
                        else if (response.Result.indexOf('Temporarily_Blocked') > -1 || response.Result.indexOf('Suspended') > -1)
                        {
                            $ionicLoading.hide();
                            swal({
                                title: "Account Suspended",
                                text: "Your account has been temporarily suspended because you entered an incorrect passwod too many times." +
                                      "<span class='show'>In most cases your account will be automatically un-suspended in 24 hours.</span>" +
                                      "<span class='show'>We really apologize for the inconvenience and ask for your patience. Our top priority is keeping Nooch safe and secure.</span>",
                                type: "error",
                                showCancelButton: true,
                                cancelButtonText: "Ok",
                                confirmButtonText: "Contact Support",
                                html: true
                            }, function (isConfirm) {
                                if (isConfirm)
                                {
                                    //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                                    $cordovaSocialSharing
                                      .shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
                                      .then(function (res) {
                                      }, function (err) {
                                          console.log('Error attempting to send email from social sharing: [' + JSON.stringify(err) + ']');
                                      });
                                }
                            });
                        }
                        else if (response.Result.indexOf('Object reference not set') > -1)
                        {
                            $scope.genericLoginError();
                        }
                        else
                        {
                            $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
                            $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
                            $localStorage.GLOBAL_VARIABLES.Pwd = data.Status;

                            $scope.fetchAfterLoginDetails();
                        }
                    }
                    else
                        CommonServices.DisplayError('Unable to login at the moment :-(');
                })
				.error(function (err) {
				    console.log('Login Attempt Error: [' + JSON.stringify(err) + ']');
				    $ionicLoading.hide();
				    $scope.genericLoginError();
				});
          })
		  .error(function (err) {
		      console.log('GetEncryptedData Error: [' + JSON.stringify(err) + ']');
		      $ionicLoading.hide();
		      $scope.genericLoginError();
		  });
      }


      $scope.genericLoginError = function () {
          swal({
              title: "Oh no",
              text: "Terribly sorry, but we're having trouble logging you in! Please try again or contact us for futher help.",
              type: "error",
              showCancelButton: true,
              cancelButtonText: "Ok",
              confirmButtonText: "Contact Support",
          }, function (isConfirm) {
              if (isConfirm)
              {
                  //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                  $cordovaSocialSharing
                    .shareViaEmail('', 'Nooch Support Request - Login Trouble', 'support@nooch.com', null, null, null)
                    .then(function (res) {
                    }, function (err) {
                        console.log('Error attempting to send email from social sharing: [' + JSON.stringify(err) + ']');
                    });
              }
          });
      }


      $scope.forgotPw = function (type) {
          var msgTxt = type == 1 ? "Enter your email address below and we will send you a reset link." : "Please make sure you entered a valid email address.";
          swal({
              title: "Forgot Password",
              text: msgTxt,
              type: "input",
              inputPlaceholder: "Email Address",
              showCancelButton: true,
              cancelButtonText: "Cancel",
              confirmButtonText: "Submit",
              closeOnConfirm: false,
              html: true,
			  customClass: "heavierText"
          }, function (inputValue) {
              if (inputValue === false) return false;

              if (inputValue === "" || inputValue.length == 0)
              {
                  swal.showInputError("Please enter the email address associated with your account.");
                  return false
              }

              if (CommonServices.ValidateEmail(inputValue))
              {
				  swal.close();

                  authenticationService.ForgotPassword(inputValue).success(function (data) {
                      console.log(data);

                      if (data.success == true)
                          swal({
							  title: "Reset Link Sent",
							  text: "If that email is associated with a Nooch account, you will receive an email with a link to reset your password.",
							  type: "success",
							  customClass: "singleBtn heavierText"
						  });
                      else
                          swal("Error", data.msg, "error");
                  }).error(function (encError) {
                      CommonServices.DisplayError('Unexpected Problem :-/');
                      console.log('Forgot PW -> Error block ' + encError);
                  });
              }
              else
                  $scope.forgotPw(2)
          });
      }


      $scope.getLocation = function () {
          $cordovaGeolocation
                .getCurrentPosition()
                .then(function (position) {
                    var lat = position.coords.latitude
                    var long = position.coords.longitude

                    $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = lat;
                    $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = long;

                    console.log('$cordovaGeolocation success -> Lat/Long: [' + lat + ', ' + long + ']');

                    $scope.loginService();
                }, function (err) {
                    console.log('$cordovaGeolocation error: [' + JSON.stringify(err) + ']');

                    // Static Loaction in case user denied
                    //$localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '31.33';
                    //$localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '54.33';

                    $scope.loginService();
                });
      }


      $scope.checkGpsStatus = function () {
          $ionicPlatform.ready(function () {
              if (window.cordova)
              {
                  cordova.plugins.diagnostic.isLocationEnabled(function (authorized) {
                      if (authorized == true)
                      {
                          console.log('GPS IS ON - CALLING GET LOACTION');
                          $scope.getLocation();
                      }
                      else
                      {
                          // User has not yet authorized location access - so just login (we request permission later only at a relevant time, i.e. on Select Recipient -> Search By Location Tab)
                          $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                          //$localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '0.00';
                          //$localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '0.00';

                          $scope.loginService();
                      }
                  }, function (error) {
                      console.log("isLocationEnabled Error: [" + JSON.stringify(error) + ']');
                  });
              }
              else // For Browser Testing
                  $scope.loginService();
          });
      }


      $scope.loginWithFB = function () {
          console.log('LoginWithFB Fired');

          if (!window.cordova)
              facebookConnectPlugin.browserInit("198279616971457");

          facebookConnectPlugin.login(['email', 'public_profile'], function (response) {
              console.log('facebookConnectPlugin Resonse: ' + JSON.stringify(response));
              $scope.fbStatus = _.get(response, 'status');
              console.log('Facebook Status: [' + $scope.loginWithFbData.fbStatus + ']');

              facebookConnectPlugin.api("/me?fields=name,email,picture.type(large)", ['email'], function (success) {
                  // success

                  $ionicLoading.show({
                      template: 'Signing in...'
                  });

                  console.log('FB Login Result: ' + JSON.stringify(success));
                  $scope.loginWithFbData.Email = _.get(success, 'email');
                  $scope.loginWithFbData.Name = _.get(success, 'name');
                  $scope.loginWithFbData.Photo = _.get(success, 'picture.data.url');
                  $scope.loginWithFbData.FBId = _.get(success, 'id');

                  if ($scope.loginWithFbData.fbStatus == 'connected')
                      $scope.isConnectedToFb = true;

                  $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginWithFbData.Email;
                  console.log('Printing from local Storage-->>' + $localStorage.GLOBAL_VARIABLES.UserName);
                  console.log('$scope.loginWithFbData: [' + JSON.stringify($scope.loginWithFbData) + ']');

                  authenticationService.LoginWithFacebookGeneric($localStorage.GLOBAL_VARIABLES.UserName, $scope.loginWithFbData.FBId, $scope.loginWithFbData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude, $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
                      .success(function (response) {
                          console.log(response);

                          //  $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
                          $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;

                          $ionicLoading.hide();
                          $scope.fetchAfterLoginDetails();

                          authenticationService.SaveMembersFBId($localStorage.GLOBAL_VARIABLES.MemberId, $scope.loginWithFbData.FBId, $scope.isConnectedToFb)
                              .success(function (response) {
                                  //$state.go('app.home');
                              })
                              .error(function (response) {
                                  console.log('saveMemberFBId Error: [' + response + ']');
                              })
                      })
                      .error(function (error) {
                          $ionicLoading.hide();
                          console.log('LoginWithFacebookGeneric Attempt Error: [' + JSON.stringify(error) + ']');
                      })
              }, function (error) {
                  console.log(error);
              })
          }, function (error) {
              console.log('facebookConnectPlugin Error response: [' + JSON.stringify(error));
              $ionicLoading.hide();
          });
      }


      $scope.fetchAfterLoginDetails = function () {

          CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName)
			  .success(function (data) {
			      $ionicLoading.hide();

			      if (data.Result != null)
			      {
			          $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;
			          $state.go('app.home');
			      }
			      else
			          CommonServices.DisplayError('Unable to login - we\'re working on it!');
			  })
              .error(function (err) {
                  $ionicLoading.hide();
                  CommonServices.DisplayError('Unable to login - we\'re working on it!');
              });
      }


      $scope.keyEntered = function () {

          var em = $scope.loginData.email;
          var pw = $scope.loginData.pwd;

          if (em != null && em.length > 4 && em.indexOf('@') > 0 && em.indexOf('.') && pw.length > 3)
              $('#loginBtn').attr('disabled', false);
          else
              $('#loginBtn').attr('disabled', true);
      }
  })
