angular.module('noochApp.resetPwdCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, resetPasswordService, $state, $ionicLoading, CommonServices, $localStorage) {
    $scope.ResetPwd = {
        newPwd: '',
        currentPwd: '',
        confirmPwd:''
        
    };

    $scope.ResetPin = {
        noochPin: '',
        newPin: '' 

    };
   
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Reset Pwd Page Is Loaded');

    })
    $scope.ResetPassword = function () {
        console.log($scope.ResetPwd.newPwd);
        if ($('#frmResetPwd').parsley().validate() == true) {
            $ionicLoading.show({
                template: 'Resetting pwd...'
            });
            CommonServices.GetEncryptedData($scope.ResetPwd.newPwd).success(function (data) {
                console.log(data);
                resetPasswordService.ResetPassword(data.Status, '').success(function (data) {
                    console.log(data);
                     if (data.Result == true) {
                        swal({
                            title: "Password Changed!",
                            text: "Your Nooch password has been changed.",
                            type: "success",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns",
                            html: true,
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $ionicLoading.hide();
                            }
                        });

                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                    else {
                        swal({
                            title: "Expired!",
                            text: "Your reset password link has expired.",
                            type: "error",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns",
                            html: true,
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $ionicLoading.hide();
                            }
                        });
                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                }).error(function (encError) {
                    console.log('came in enc error block ' + encError);
                    $ionicLoading.hide();
                });
            }).error(function (encError) {
                console.log('came in enc error block ' + encError);
            });
        }
       
    }

    $scope.ResetPin = function () {
        var encryptedNoochPin = '';
        var encryptedNewPin = '';
        console.log($scope.ResetPin.noochPin);
        if ($('#frmResetPin').parsley().validate() == true) {
            $ionicLoading.show({
                template: 'Resetting pin...'
            });
            CommonServices.GetEncryptedData($scope.ResetPin.noochPin).success(function (data) {
                console.log(data);
                encryptedNoochPin = data.Status;
               
            }).error(function (encError) {
                console.log('came in enc error block ' + encError);
            });

            CommonServices.GetEncryptedData($scope.ResetPin.newPin).success(function (data) {
                console.log(data);
                encryptedNewPin = data.Status;
                resetPasswordService.ResetPin(encryptedNoochPin, encryptedNewPin).success(function (data) {
                    console.log(data);
                    console.log(data.Result.indexOf('Incorrect'));
                    
                    if (data.Result.indexOf('oAuth') > -1)
                    {
                        $localStorage.GLOBAL_VARIABLES.IsDemoDone = false;
                        $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled = false;
                        $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                        $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '';
                        $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '';
                        $localStorage.GLOBAL_VARIABLES.MemberId = '';
                        $localStorage.GLOBAL_VARIABLES.UserName = '';
                        $localStorage.GLOBAL_VARIABLES.AccessToken = '';
                        $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven = false;
                        $localStorage.GLOBAL_VARIABLES.DeviceId = '';
                        $localStorage.GLOBAL_VARIABLES.DeviceToken = '';
                        $localStorage.GLOBAL_VARIABLES.DeviceOS = '';
                        console.log($localStorage.GLOBAL_VARIABLES);
                        $ionicLoading.hide();
                        $state.go('login');
                    }

                   else if (data.Result == true) {
                        swal({
                            title: "Pin Changed!",
                            text: "Your Nooch pin has been changed.",
                            type: "success",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns",
                            html: true,
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $ionicLoading.hide();
                            }
                        });

                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                    else if (data.Result.indexOf('Incorrect')>-1) {
                        swal({
                            title: "Incorrect pin!",
                            text: "Incorrect pin. Please check your current pin.",
                            type: "error",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns",
                            html: true,
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $ionicLoading.hide();
                            }
                        });
                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                }).error(function (encError) {
                    console.log('came in enc error block ' + encError);
                    $ionicLoading.hide();
                });

            }).error(function (encError) {
                console.log('came in enc error block ' + encError);
            });
            console.log(encryptedNewPin);
           

        }

    }

})
