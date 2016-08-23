angular.module('noochApp.resetPwdCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, resetPasswordService, $state, $ionicLoading, CommonServices, $localStorage, $cordovaNetwork) {
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

      //  if ($cordovaNetwork.isOnline()) {
            console.log($scope.ResetPwd.newPwd);
            if ($('#frmResetPwd').parsley().validate() == true) {
                $ionicLoading.show({
                    template: 'Resetting pwd...'
                });

                CommonServices.GetEncryptedData($scope.ResetPwd.currentPwd).success(function (data) {
                    console.log(data.Status);
                    console.log($localStorage.GLOBAL_VARIABLES.Pwd);

                    if ($localStorage.GLOBAL_VARIABLES.Pwd == data.Status) {

                        CommonServices.GetEncryptedData($scope.ResetPwd.newPwd).success(function (data) {
                            console.log(data);
                            resetPasswordService.ResetPassword(data.Status,true).success(function (data) {
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
                                        title: "Oppss...!",
                                        text: "Something went wrong",
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
                          //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                            { CommonServices.logOut(); }
                        });
                    }
                    else {
                        swal({
                            title: "Incorrect Password!",
                            text: "Current Password is incorrect.",
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
                    }
                }).error(function (data) {
                 //   if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    { CommonServices.logOut(); }
                });


            }
        //}
        //else{
        //        swal("Oops...", "Internet not connected!", "error");
        //      }
    }

    $scope.ResetPin = function () {
        //  if ($cordovaNetwork.isOnline()) {
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
                resetPasswordService.ResetPin(encryptedNewPin,encryptedNoochPin ).success(function (data) {
                    console.log(data);
                    console.log(data.Result.indexOf('Incorrect'));

                    if (data.Result.indexOf('oAuth') > -1)
                    {
                         CommonServices.logOut();  
                    }

                   else if (data.Result == 'Pin changed successfully.') {
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
                  //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                    { CommonServices.logOut(); }
                });

            }).error(function (encError) {
                console.log('came in enc error block ' + encError);
              //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                { CommonServices.logOut(); }
            });
            console.log(encryptedNewPin);


        }
        //}
        //else{
        //        swal("Oops...", "Internet not connected!", "error");
        //      }

    }

})
