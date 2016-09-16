angular.module('noochApp.resetPwdCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, $rootScope, $state, $ionicLoading, $localStorage, $cordovaNetwork,
									  $timeout, $cordovaSocialSharing, resetPasswordService, CommonServices, $cordovaGoogleAnalytics) {

    $scope.$on("$ionicView.enter", function (event, data) {
        //console.log('Reset Pwd Page Is Loaded');

        $scope.ResetPwd = {
            newPwd: '',
            currentPwd: '',
            confirmPwd: ''
        };

        $scope.ResetPinData = {
            currentPin: '',
            newPin: '',
            confirmPin: ''
        };

        $scope.enteringPin = 'current';
        $scope.currentPinEncr = '';

        if ($('.instructionTxt').hasClass('expanded'))
            $('.instructionTxt').removeClass('expanded');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Reset Pwd/PIN");
        })
    })


    $scope.ResetPassword = function () {

        //  if ($cordovaNetwork.isOnline()) {
        console.log($scope.ResetPwd.newPwd);
        if ($('#frmResetPwd').parsley().validate() == true)
        {
            $ionicLoading.show({
                template: 'Resetting Password...'
            });

            CommonServices.GetEncryptedData($scope.ResetPwd.currentPwd).success(function (data) {
                console.log(data.Status);

                if ($localStorage.GLOBAL_VARIABLES.Pwd == data.Status)
                {
                    CommonServices.GetEncryptedData($scope.ResetPwd.newPwd).success(function (pwData) {
                        console.log(pwData);

                        resetPasswordService.ResetPassword(pwData.Status, true)
                            .success(function (data) {
                                console.log(data);

                                $scope.ResetPwd.newPwd = '';
                                $scope.ResetPwd.currentPwd = '';
                                $scope.ResetPwd.confirmPwd = '';

                                $ionicLoading.hide();

                                if (data.Result == true)
                                {
                                    swal({
                                        title: "Password Updated",
                                        text: "Your password was changed successfully.",
                                        type: "success",
                                        confirmButtonColor: "#3fabe1",
                                        html: true,
                                    }, function () {
                                        $state.go('app.securitySetting');
                                    });
                                }
                                else
                                {
                                    swal({
                                        title: "Error",
                                        text: "Something went wrong :-(",
                                        type: "error",
                                        confirmButtonColor: "#3fabe1",
                                        html: true,
                                    });
                                }
                            })
                            .error(function (encError) {
                                console.log('ResetPassword Error: [' + encError + ']');
                                $ionicLoading.hide();
                            });
                    })
                    .error(function (encError) {
                        console.log('GetEncryptedData Error: [' + encError + ']');
                        $ionicLoading.hide();
                        if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                            CommonServices.logOut();
                    });
                }
                else
                {
                    $ionicLoading.hide();
                    swal({
                        title: "Incorrect Password",
                        text: "Please try again!",
                        type: "error",
                        confirmButtonColor: "#3fabe1"
                    });
                }
            })
            .error(function (data) {
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        }
        //}
        //else
        //  swal("Error", "Internet not connected!", "error");
    }


    $scope.ResetPin = function () {
        //  if ($cordovaNetwork.isOnline()) {

        $ionicLoading.show({
            template: 'Resetting PIN...'
        });

        CommonServices.GetEncryptedData($scope.ResetPinData.newPin)
			.success(function (data) {
			    var encryptedNewPin = data.Status;

			    resetPasswordService.ResetPin(encryptedNewPin, $scope.currentPinEncr)
					.success(function (data) {
					    //console.log(data);

					    $ionicLoading.hide();

					    if (data.Result == 'Pin changed successfully.')
					    {
					        swal({
					            title: "PIN Updated",
					            text: "Your PIN was changed successfully.",
					            type: "success",
					            confirmButtonColor: "#3fabe1",
					        }, function () {
					            $state.go('app.securitySetting');
					        });
					    }
					    else if (data.Result.indexOf('Incorrect') > -1)
					    {
					        $scope.applyError('current');
					        swal({
					            title: "Incorrect PIN",
					            text: "Please try again!",
					            type: "error",
					            confirmButtonColor: "#3fabe1",
					            confirmButtonText: "Ok"
					        });
					    }
					    else if (data.Result.indexOf('oAuth') > -1)
					        CommonServices.logOut();
					})
					.error(function (error) {
					    console.log('ResetPin Error: [' + JSON.stringify(error) + ']');
					    $ionicLoading.hide();
					    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
					        CommonServices.logOut();
					});
			})
			.error(function (error) {
			    console.log('Reset PIN -> GetEncryptedData Error: [' + JSON.stringify(error) + ']');
			    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
			        CommonServices.logOut();
			});
        //}
        //else
        //  swal("Error", "Internet not connected!", "error");
    }


    $scope.numTapped = function (num) {
        //console.log('Entering: [' + $scope.enteringPin + ']  -  New Digit: [' + num + ']');

        if ($scope.pauseForError != true)
        {
            switch ($scope.enteringPin)
            {
                case 'current':
                    var pin = $scope.ResetPinData.currentPin;
                    break;
                case 'new':
                    var pin = $scope.ResetPinData.newPin;
                    break;
                case 'confirm':
                    var pin = $scope.ResetPinData.confirmPin;
                    break;
            }

            if (num < 10)
            {
                pin += num;

                switch ($scope.enteringPin)
                {
                    case 'current':
                        $scope.ResetPinData.currentPin = pin;
                        break;
                    case 'new':
                        $scope.ResetPinData.newPin = pin;
                        break;
                    case 'confirm':
                        $scope.ResetPinData.confirmPin = pin;
                        break;
                }

                if (pin.length < 4)
                {
                    if (pin.length == 1)
                        $('.indicatorDotWrap .col div:first-child').addClass('filled');
                    if (pin.length == 2)
                        $('.indicatorDotWrap .col div:nth-child(2)').addClass('filled');
                    if (pin.length == 3)
                        $('.indicatorDotWrap .col div:nth-child(3)').addClass('filled');
                }
                else
                {
                    $('.indicatorDotWrap .col div:last-child').addClass('filled');

                    // Check if Current PIN was correct
                    if ($scope.enteringPin == 'current')
                    {
                        CommonServices.GetEncryptedData(pin)
                            .success(function (data) {

                                $scope.currentPinEncr = data.Status;

                                resetPasswordService.validateCurrentPin($scope.currentPinEncr)
                                    .success(function (response) {
                                        console.log(response);

                                        if (response.Result == "Success")
                                        {
                                            $scope.enteringPin = 'new';

                                            if ($('.instructionTxt').hasClass('expanded'))
                                                $('.instructionTxt').removeClass('expanded');

                                            $('.numPadWrap').addClass('bounceOutLeft');
                                            $timeout(function () {
                                                $('.numPadWrap').removeClass('bounceOutLeft').addClass('bounceInRight');
                                                $('.indicatorDotWrap .col div').removeClass('filled');
                                            }, 600);
                                        }
                                        else if (response.Result != null && response.Result.indexOf('will be suspended') > -1)
                                        {
                                            $scope.applyError('current');
                                            swal({
                                                title: "Careful...",
                                                text: "To keep Nooch safe your account will be suspended if you enter another incorrect PIN.",
                                                type: "warning",
                                                confirmButtonColor: "#3fabe1"
                                            });
                                        }
                                        else if (response.Result != null && response.Result.indexOf('suspended') > -1)
                                        {
                                            $scope.applyError('current');
                                            swal({
                                                title: "Account Suspended",
                                                text: "To keep Nooch safe your account has been temporarily suspended because you entered an incorrect PIN too many times." +
                                                      "<span class='show'>In most cases your account will be automatically un-suspended in 24 hours.</span>",
                                                type: "error",
                                                showCancelButton: true,
                                                cancelButtonText: "Ok",
                                                confirmButtonColor: "#3fabe1",
                                                confirmButtonText: "Contact Support",
                                                html: true
                                            }, function (isConfirm) {
                                                if (isConfirm)
                                                {
                                                    $cordovaSocialSharing.shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
                                                        .then(function (result) {
                                                            if (result.completed)
                                                            {
                                                                swal("Message Sent", "Your email has been sent - we will get back to you soon!", "success");
                                                                $state.go('app.home');
                                                            }
                                                        }, function (err) {
                                                            swal("Message Not Sent", "Your email was not sent - please try again!", "error");
                                                            console.log('Error attempting to send email from social sharing: [' + err + ']');
                                                        });
                                                }
                                                else
                                                    $state.go('app.home');
                                            });
                                        }
                                        else if (response.Result != "Success")
                                            $scope.applyError('current');
                                    })
                                    .error(function (error) {
                                        console.log('validateCurrentPin Error: [' + JSON.stringify(error) + ']');

                                        if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                            CommonServices.logOut();
                                        else
                                            $scope.applyError('current');
                                    });
                            })
                            .error(function (error) {
                                console.log('NumTapped -> GetEncryptedData Error: [' + error + ']');
                            });
                    }
                    else if ($scope.enteringPin == 'new')
                    {
                        $scope.ResetPinData.newPin = pin;
                        $scope.enteringPin = 'confirm';

                        if ($('.instructionTxt').hasClass('expanded'))
                            $('.instructionTxt').removeClass('expanded');

                        $('.numPadWrap').addClass('bounceOutLeft');
                        $timeout(function () {
                            $('.numPadWrap').removeClass('bounceOutLeft').addClass('bounceInRight');
                            $('.indicatorDotWrap .col div').removeClass('filled');
                        }, 600);

                        //pin = '';
                    }
                    else if ($scope.enteringPin == 'confirm')
                    {
                        // NOW CHECK IF NEW AND CONFIRM PIN MATCH
                        if ($scope.ResetPinData.newPin != pin)
                            $scope.applyError('new');
                        else
                            $scope.ResetPin();
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

                switch ($scope.enteringPin)
                {
                    case 'current':
                        $scope.ResetPinData.currentPin = pin;
                        break;
                    case 'new':
                        $scope.ResetPinData.newPin = pin;
                        break;
                    case 'confirm':
                        $scope.ResetPinData.confirmPin = pin;
                        break;
                }
            }
        }

        //console.log("FINISHING numTapped... " + JSON.stringify($scope.ResetPinData));
    }


    $scope.applyError = function (type) {
        $scope.pauseForError = true;
        var errorTxt = type == 'new' ? "PINs did not match! &nbsp;Try again..." : "Incorrect PIN! &nbsp;Try again...";

        $('.indicatorDotWrap .col div').addClass('incorrect');
        $('.indicatorDotWrap').addClass('shake');
        $('.instructionTxt').html(errorTxt).addClass('expanded');

        $scope.enteringPin = type;// Either 'current' or 'new';

        $scope.ResetPinData.newPin = '';
        $scope.ResetPinData.confirmPin = '';
        if (type == 'current')
            $scope.ResetPinData.currentPin = '';

        $timeout(function () {
            $('.indicatorDotWrap').removeClass('shake');
            $('.indicatorDotWrap .col div').removeClass('filled incorrect');
            $scope.pauseForError = false;
        }, 1200);
    }
})