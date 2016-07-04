angular.module('starter.controllers', ['starter.services'])
    .controller('LoginCtrl', function ($scope, authenticationService) {

        $scope.$on("$ionicView.enter", function (event, data) {
            // handle event
            console.log('Login Controller loaded');
            // swal("Here's a message!");
        });

        $scope.SignIn = function (username, pwd) {
            if ($('#frmLogin').parsley().validate() == true) {
                authenticationService.Login(username, pwd, '', function (response) {
                    console.log(response.Result + ',' + response.Result.indexOf('Temporarily_Blocked'));

                    if (response.Result.indexOf('Invalid ') > -1 || response.Result.indexOf('incorrect ') > -1 || response.Result.indexOf('Temporarily_Blocked') > -1) {
                        swal(response.Result);
                    }
                    else {
                        swal("login successfull");
                    }
                });
            }
        }
    })

.controller('SignupCtrl', function ($scope) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Signup Controller loaded');
        // swal("Here's a message!");


    });


});