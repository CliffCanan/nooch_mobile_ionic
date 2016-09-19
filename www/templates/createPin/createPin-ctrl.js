angular.module('noochApp.createPinCtrl', ['noochApp.createPin-service', 'noochApp.services'])

    .controller('createPinCtrl', function ($scope, $state, $rootScope, $localStorage, $cordovaGeolocation, $cordovaSocialSharing,
                                           $timeout, createPinServices, $ionicLoading, CommonServices, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Create PIN Controller Loaded');


            $ionicPlatform.ready(function () {
                if (typeof analytics !== 'undefined') analytics.trackView("Singup Flow - Create PIN");
            })

            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
            else
            {
                $("#pinTxt").focus();
                $rootScope.signUpData.Pin = '';
                $scope.firstPinEntered = '';
                $scope.onConfirm = false;

                if ($localStorage.GLOBAL_VARIABLES.DeviceToken == '')
                    $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NoDevToken';
                else if ($localStorage.GLOBAL_VARIABLES.DeviceToken == null)
                    $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NoDevToken';
                else
                    console.log($localStorage.GLOBAL_VARIABLES.DeviceToken);
            }
        });


        $scope.signUpFn = function () {
            //console.log('signUpFn Fired');
            //console.log($rootScope.signUpData);

            //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Creating PIN...'
            });


            if ($rootScope.signUpData.Photo != null && $rootScope.signUpData.Photo.indexOf('base64'))
                $rootScope.signUpData.Photo = $rootScope.signUpData.Photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');


            CommonServices.GetEncryptedData($rootScope.signUpData.Password)
				.success(function (data) {
				    $rootScope.signUpData.Password = data.Status;

				    createPinServices.Signup($rootScope.signUpData)
						.success(function (data) {
						    console.log(data);

						    $ionicLoading.hide();

						    if (data != null && data.indexOf('Thanks for registering') > -1)
						    {
						        $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
						        //console.log('RunTime values ----->> DeviceId And DeviceToken');
						        //console.log($localStorage.GLOBAL_VARIABLES.DeviceId);
						        //console.log($localStorage.GLOBAL_VARIABLES.DeviceToken);
						        $scope.SignIn();
						    }
						    else if (data == 'Duplicate random Nooch ID was generating')
						    {
						        swal("Uh Oh...", "Looks like that email is already registered!", "error");
						        $state.go('login');
						    }
						    else
							{
								swal({
									title: "Unexpected Error",
									text: "Oh no! Something went wrong - please try again or contact our support team to let us know!",
									type: "error",
									showCancelButton: true,
									confirmButtonText: "Contact Support",
									html: true,
								}, function (isConfirm) {
									if (isConfirm)
									{
										$cordovaSocialSharing
											.shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
											.then(function (result) {
												swal({
													title: "Message Sent",
													text: "Your email has been sent - we will get back to you soon!",
													type: "success",
													customeClass: "singleBtn"
												}, function () {
													$state.go('signup');
												});
											}, function (err) {
												console.log('Error attempting to send email from social sharing: [' + JSON.stringify(err) + ']');
												$state.go('signup');
											});
									}
									else
									  $state.go('signup');
								});
							}
						})
						.error(function (encError) {
						    $ionicLoading.hide();
						    console.log('Signup Attempt -> Error [' + encError + ']');
						    $state.go('signup');
						})
				})
            //}
            //else
            //    swal("Error", "Internet not connected!", "error");
        };


        $scope.SignIn = function () {

            //if ($cordovaNetwork.isOnline())
            //{
            $ionicLoading.show({
                template: 'Grabbing account details...'
            });

            authenticationService.Login($rootScope.signUpData.Email, $rootScope.signUpData.Password, $rootScope.signUpData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
                  $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken, $localStorage.GLOBAL_VARIABLES.DeviceOS)
	                  .success(function (response) {

	                      $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;

	                      console.log(response);

	                      if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1)
	                      {
	                          $ionicLoading.hide();
	                          swal("Error", response.Result, "error");
	                      }
	                      else if (response.Result.indexOf('Temporarily_Blocked') > -1)
	                      {
	                          $ionicLoading.hide();
	                          swal({
	                              title: "Oh No!",
	                              text: "To keep Nooch safe your account has been temporarily suspended because you entered an incorrect passwod too many times.<br><br> In most cases your account will be automatically un-suspended in 24 hours. you can always contact support if this is an error.<br><br> We really apologize for the inconvenience and ask for your patience. Our top priority is keeping Nooch safe and secure.",
	                              type: "error",
	                              showCancelButton: true,
	                              confirmButtonText: "Contact Support",
	                              html: true,
	                          }, function (isConfirm) {
	                              if (isConfirm)
	                              {
	                                  // toArr, ccArr and bccArr must be an array, file can be either null, string or array
	                                  //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
	                                  $cordovaSocialSharing
	                                    .shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
	                                    .then(function (result) {
	                                        swal("Message Sent", "Your email has been sent - we will get back to you soon!", "success");
	                                    }, function (err) {
	                                        // An error occurred. Show a message to the user
	                                        console.log('Error attempting to send email from social sharing: [' + err + ']');
	                                    });
	                              }
	                          });
	                      }
	                      else
	                      {
	                          $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
	                          $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
	                          $localStorage.GLOBAL_VARIABLES.Pwd = $rootScope.signUpData.Password;

	                          console.log($localStorage.GLOBAL_VARIABLES);

	                          fetchAfterLoginDetails();
	                      }
	                  })
					  .error(function (res) {
					      console.log('Login Attempt Error: [' + res + ']');
					  });

            function fetchAfterLoginDetails() {

                CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName)
					.success(function (data) {
					    $ionicLoading.hide();

					    //console.log(data);

					    if (data != null)
					    {
					        $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;
					        $state.go('welcome');
					    }
					})
					.error(function (err) {
					    $ionicLoading.hide();
					    swal("Error", err.Result, "error");
					});
            }
            //}
            //else
            //    swal("Oops...", "Internet not connected!", "error");
        }


        $scope.numTapped = function (num) {
            //console.log(num);
            var pin = $scope.signUpData.Pin;
            //console.log($scope.signUpData.Pin);

            if ($scope.pauseForError != true)
            {
                if (num < 10)
                {
                    if (pin.length < 3)
                    {
                        pin += num;

                        if (pin.length == 1)
                            $('.indicatorDotWrap .col div:first-child').addClass('filled');
                        if (pin.length == 2)
                            $('.indicatorDotWrap .col div:nth-child(2)').addClass('filled');
                        if (pin.length == 3)
                            $('.indicatorDotWrap .col div:nth-child(3)').addClass('filled');
                    }
                    else
                    {
                        pin += num;

                        $('.indicatorDotWrap .col div:last-child').addClass('filled');

                        // 4th Digit Entered
                        if ($scope.onConfirm == false)
                        {
                            $('#header').text('Confirm Your PIN');

                            $('.numPadWrap').addClass('bounceOutLeft');
                            $timeout(function () {
                                $('.numPadWrap').removeClass('bounceOutLeft').addClass('bounceInRight');
                                $('.indicatorDotWrap .col div').removeClass('filled');
                            }, 700);

                            // Save the 1st PIN in new var, reset signUpData.Pin so user can Confirm by entering the PIN again
                            $scope.firstPinEntered = pin;
                            pin = '';

                            $scope.onConfirm = true;
                        }
                        else
                        {
                            // NOW CHECK IF 1ST AND 2ND ENTERED PIN MATCH
                            if ($scope.firstPinEntered != pin)
                            {
                                $scope.pauseForError = true;
                                $('.indicatorDotWrap .col div').addClass('incorrect');
                                $('.indicatorDotWrap').addClass('shake');
                                $('.instructionTxt').html('PINs did not match!<br\/>Try again...').addClass('text-danger');

                                $timeout(function () {
                                    $('#header').text('Create Your PIN');
                                    $('.indicatorDotWrap').removeClass('shake');
                                    $('.indicatorDotWrap .col div').removeClass('filled incorrect');
                                    $scope.firstPinEntered = '';
                                    $scope.signUpData.Pin = '';
                                    $scope.onConfirm = false;
                                    $scope.pauseForError = false;
                                }, 1200);
                            }
                            else
                                $scope.signUpFn();
                        }
                    }
                }
                else if (num == 10)
                {
                    if (pin.length > 0)
                    {
                        pin = pin.substring(0, pin.length - 1)
                        if (pin.length == 0)
                            $('.indicatorDotWrap .col div:first-child').removeClass('filled');
                        if (pin.length == 1)
                            $('.indicatorDotWrap .col div:nth-child(2)').removeClass('filled');
                        if (pin.length == 2)
                            $('.indicatorDotWrap .col div:nth-child(3)').removeClass('filled');
                        if (pin.length == 3)
                            $('.indicatorDotWrap .col div:last-child').removeClass('filled');
                    }
                }
            }

            $scope.signUpData.Pin = pin;
        }
    });
