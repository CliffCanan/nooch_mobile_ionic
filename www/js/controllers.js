angular.module('starter.controllers', ['starter.services'])
    .controller('LoginCtrl', function($scope, authenticationService) {

        $scope.$on("$ionicView.enter", function(event, data) {
            // handle event
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

        $scope.SignIn = function() {
            if ($('#frmLogin').parsley().validate() == true) {
                username = $scope.loginData.email;
                pwd = $scope.loginData.pwd;
                remmbrMe = $scope.loginData.rmmbrMe.val;
                console.log(username,pwd);
                authenticationService.Login(username, pwd, remmbrMe, function(response) {
                    console.log(response.Result + ',' + response.Result.indexOf('Temporarily_Blocked'));

                    if (response.Result.indexOf('Invalid ') > -1 || response.Result.indexOf('incorrect ') > -1) {
                        swal(response.Result);
                    } else if (response.Result.indexOf('Temporarily_Blocked') > -1) {
                        swal({
                            title: "Oh No!",
                            text: "To keep Nooch safe your account has been temporarily suspended because you entered an incorrect passwod too many times.<br><br> In most cases your account will be automatically un-suspended in 24 hours. you can always contact support if this is an error.<br><br> We really apologize for the inconvenience and ask for your patience.Our top priority id keeping Nooch safe and secure.",
                            type: "error",
                            showCancelButton: true,
                            cancelButtonText: "Ok",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Contact Support",
                            customClass: "stackedBtns",
                            html: true,
                        }, function(isConfirm) {
                            if (isConfirm) {

                            }
                        });
                    } else {
                        swal("login successfull");
                    }
                });
            }
        }
    })


    .controller('SignupCtrl', function($scope, $location) {
        $scope.signupData = {
            Name: '',
            Email: '',
            Password: ''
        };


        $scope.gotoSignInPage = function() {
            console.log('came in btn click');
            $location.path("/login");

        };
        $scope.signUpClick = function() {


            var flag = $('#submitForm').parsley().validate();
            console.log(flag);
            if (flag) {
                console.log('came in btn click');

                console.log('signupData ' + JSON.stringify($scope.signupData));
            }
        };

        $scope.$on("$ionicView.enter", function(event, data) {
            // handle event
            console.log('Signup Controller loaded');

            console.log('signupData ' + JSON.stringify($scope.signupData));
            // swal("Here's a message!");
        });
    })



    .controller('AppCtrl', function ($scope, authenticationService) {
        $scope.$on("$ionicView.enter", function (event, data) {
            // handle event
            console.log('App ctrl loaded');       


        });
    })




.controller('DashboardCtrl', function ($scope, authenticationService) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('dash ctrl loaded');


    });
    
})

 .controller('SettingCtrl', function ($scope, authenticationService) {

        $scope.$on("$ionicView.enter", function (event, data) {
            // handle event
            console.log('Setting ctrl loaded');


        });
    
});