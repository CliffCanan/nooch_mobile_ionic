angular.module('noochApp.resetPwdCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, resetPasswordService, $state, $ionicLoading, CommonServices) {
    $scope.ResetPwd = {
        newPwd: '',
        currentPwd: '',
        confirmPwd:''
        
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

})
