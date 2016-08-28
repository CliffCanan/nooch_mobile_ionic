angular.module('noochApp.resetPwdCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, resetPasswordService, $state, $ionicLoading, CommonServices, $localStorage, $cordovaNetwork) {

    $scope.ResetPwd = {
        newPwd: '',
        currentPwd: '',
        confirmPwd: ''
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
        if ($('#frmResetPwd').parsley().validate() == true)
        {
            $ionicLoading.show({
                template: 'Submitting...'
            });

            CommonServices.GetEncryptedData($scope.ResetPwd.currentPwd).success(function (data) {
                console.log(data.Status);
                //console.log($localStorage.GLOBAL_VARIABLES.Pwd);

                if ($localStorage.GLOBAL_VARIABLES.Pwd == data.Status)
                {
                    CommonServices.GetEncryptedData($scope.ResetPwd.newPwd).success(function (data) {
                        console.log(data);

                        resetPasswordService.ResetPassword(data.Status, true).success(function (data) {
                            console.log(data);

                            $ionicLoading.hide();

                            if (data.Result == true)
                            {
                                swal({
                                    title: "Password Changed!",
                                    text: "Your Nooch password has been changed.",
                                    type: "success",
                                    confirmButtonColor: "#3fabe1",
                                    confirmButtonText: "Ok",
                                    customClass: "stackedBtns",
                                    html: true,
                                });

                                $scope.ResetPwd.newPwd = '';
                                $scope.ResetPwd.currentPwd = '';
                                $scope.ResetPwd.confirmPwd = '';
                            }
                            else
                            {
                                swal({
                                    title: "Oppss...!",
                                    text: "Something went wrong",
                                    type: "error",
                                    confirmButtonColor: "#3fabe1",
                                    confirmButtonText: "Ok",
                                    customClass: "stackedBtns",
                                    html: true,
                                });
                                $scope.ResetPwd.newPwd = '';
                                $scope.ResetPwd.currentPwd = '';
                                $scope.ResetPwd.confirmPwd = '';
                            }
                        }).error(function (encError) {
                            console.log('ResetPassword Error: [' + encError + ']');
                            $ionicLoading.hide();
                        });
                    }).error(function (encError) {
                        console.log('GetEncryptedData Error: [' + encError + ']');
                        if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                            CommonServices.logOut();
                    });
                }
                else
                {
                    $ionicLoading.hide();
                    swal({
                        title: "Incorrect Password!",
                        text: "Current Password is incorrect.",
                        type: "error",
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Ok",
                        customClass: "stackedBtns"
                    });
                }
            }).error(function (data) {
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        }
        //}
        //else
        //  swal("Oops...", "Internet not connected!", "error");
    }

    $scope.ResetPin = function () {
        //  if ($cordovaNetwork.isOnline()) {
        var encryptedNoochPin = '';
        var encryptedNewPin = '';
        console.log($scope.ResetPin.noochPin);

        if ($('#frmResetPin').parsley().validate() == true)
        {
            $ionicLoading.show({
                template: 'Resetting PIN...'
            });

            CommonServices.GetEncryptedData($scope.ResetPin.noochPin).success(function (data) {
                console.log(data);
                encryptedNoochPin = data.Status;
            }).error(function (error) {
                console.log('Reset PIN -> GetEncryptedData Error: [' + error + ']');
            });

            CommonServices.GetEncryptedData($scope.ResetPin.newPin).success(function (data) {
                console.log(data);
                encryptedNewPin = data.Status;

                resetPasswordService.ResetPin(encryptedNewPin, encryptedNoochPin).success(function (data) {
                    console.log(data);
                    console.log(data.Result.indexOf('Incorrect'));

                    $ionicLoading.hide();

                    if (data.Result.indexOf('oAuth') > -1)
                        CommonServices.logOut();
                    else if (data.Result == 'Pin changed successfully.')
                    {
                        swal({
                            title: "PIN Updated",
                            text: "Your PIN has been changed successfully.",
                            type: "success",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns"
                        });

                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                    else if (data.Result.indexOf('Incorrect') > -1)
                    {
                        swal({
                            title: "Incorrect PIN",
                            text: "Please try again!",
                            type: "error",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns"
                        });

                        $scope.ResetPwd.newPwd = '';
                        $scope.ResetPwd.currentPwd = '';
                        $scope.ResetPwd.confirmPwd = '';
                    }
                }).error(function (error) {
                    console.log('ResetPin Error: [' + error + ']');
                    $ionicLoading.hide();
                    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                });

            }).error(function (error) {
                console.log('Reset PIN -> GetEncryptedData Error: [' + error + ']');
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        }
        //}
        //else
        //  swal("Oops...", "Internet not connected!", "error");
    }
})