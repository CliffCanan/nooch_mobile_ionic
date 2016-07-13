angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function ($scope, authenticationService) {
    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('App ctrl loaded');
    });


    //$scope.settingsClick = function () {
    //    $state.go("app.setting");
    //};
})


/******************/
/***  REGISTER  ***/
/******************/
.controller('SignupCtrl', function ($scope, $location, $ionicModal) {

    $scope.signupData = {
        Name: '',
        Email: '',
        Password: ''
    };

    $scope.gotoSignInPage = function () {
        console.log('came in btn click');
        $location.path("#/login");
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Signup Controller loaded');

        console.log('signupData ' + JSON.stringify($scope.signupData));
        // swal("Here's a message!");
    });


    $scope.signUpClick = function () {

        var flag = $('#submitForm').parsley().validate();
        console.log(flag);

        if (flag)
        {
            console.log('signupData ' + JSON.stringify($scope.signupData));
        }
    };

    $scope.openTos = function () {
        $scope.openTosModal();
        console.log("Clicked Social Setting");
    };

    // Viewing TOS Webview (in an Ionic Modal)
    $ionicModal.fromTemplateUrl('tosModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.tosModal = modal;
    });

    $scope.openTosModal = function () {
        $scope.tosModal.show();
    };

    $scope.closeTosModal = function () {
        $scope.tosModal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.tosModal.remove();
    });
})


/***************/
/***  LOGIN  ***/
/***************/
 .controller('LoginCtrl', function ($scope, authenticationService, $state, $ionicLoading) {

     $scope.$on("$ionicView.enter", function (event, data) {
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

     $scope.SignIn = function () {
         if ($('#frmLogin').parsley().validate() == true)
         {
             $ionicLoading.show({
                 template: 'Loading...'
             });

             username = $scope.loginData.email;
             pwd = $scope.loginData.pwd;
             remmbrMe = $scope.loginData.rmmbrMe.val;

             authenticationService.Login(username, pwd, remmbrMe, function (response) {

                 $scope.loginData.email = '';
                 $scope.loginData.pwd = '';
                 $scope.loginData.rmmbrMe.val = false;

                 console.log(response.Result + ',' + response.Result.indexOf('Temporarily_Blocked'));
                 console.log(response);

                 if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1)
                 {
                     $ionicLoading.hide();
                     swal(response.Result);
                 }
                 else if (response.Result.indexOf('Temporarily_Blocked') > -1)
                 {
                     $ionicLoading.hide();
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
                     $ionicLoading.hide();
                     swal("login successfull");
                     // $state.go("#/app/dashboard"); --not working
                 }
             });
         }
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
                 swal("Success!", "Input email validated, need to submit to sever here. Input was: [" + inputValue + "]", "success");
             }
             else
             {
                 $scope.forgotPw(2)
             }
         });
     }

 })


/*******************/
/***  DASHBOARD  ***/
/*******************/
.controller('DashboardCtrl', function ($scope, authenticationService) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('dash ctrl loaded');
    });
})


/******************/
/*** STATISTICS ***/
/******************/
.controller('StatisticsCtrl', function ($scope, authenticationService) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Statistics Controller Loaded');
    })
})


/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, authenticationService, $state) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load

     });

     $scope.go = function (data) {
         console.log(data);
         if (data == 'Social')
         {
             $state.go('socialSetting');
             console.log("Clicked Social Setting");
         }
         else if (data == 'Notification')
         {
             $state.go('NotificationSetting');
             console.log("Navigated Succesfully to my notification page");
         }
         else if (data == 'Security')
         {
             $state.go('securitySetting');
             console.log("State Navigated Success -- Security");
         }
         else if (data == 'MyProfile')
         {
             $state.go('myProfile');
             console.log("Navigated Succesfully to my profile page");
         }
     }

 })


.controller('socialSettingCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Social Setting Controller Loadad');

    })
    $scope.GoBack = function () {
        console.log("Back Button Clicked");
        $state.go('app.setting');
    }
})


.controller('myProfileCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
    })

    $scope.GoBack = function () {
        console.log("Back Button Clicked");
        $state.go('app.setting');
    }
})


.controller('securitySettingCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loadad');
    })

    $scope.GoBack = function () {
        $state.go('app.setting');
    }

    $scope.goo = function () {
        console.log("Entered in Security Setting Controller");
        $state.go('ResetPwd');
    }
})


/*****************/
/***  HISTORY  ***/
/*****************/
.controller('historyCtrl', function ($scope, authenticationService) {
   
    $scope.$on("$ionicView.enter", function (event, data) {
         
        console.log('History Page Loaded');
    })
})


//Surya Testing Contact plugin
.controller('AccountCtrl', function ($scope, $cordovaContacts, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('History Page Loaded');

        $scope.go = function (data) {
            console.log(data);
            if (data == 'howMuch')
            {
                $state.go('howMuch');
            }
            else if (data == 'login')
            {
                $state.go('login');
            }
            else if (data == 'signup')
            {
                $state.go('signup');
            }
            else if (data == 'TrnsDetails')
            {
                $state.go('TransferDetails');             
            }
        }
        $scope.getContact = function () {
            $cordovaContacts.pickContact().then(function (result) {
                console.log(result);
            });
        }

        $scope.getContacts = function () {
            $cordovaContacts.find({ multiple: true })
                .then(function (result) { console.log(result); });
        }
    })
})
//have to delete after testing 


/**********************/
/*** Reset Password ***/
/**********************/

.controller('resetPwdCtrl', function ($scope, authenticationService, $state) {
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Reset Pwd Page Is Loaded');

    })
    $scope.GoBack = function () {
        console.log("just Touched in reset pwd Controller");
        $state.go('securitySetting');
    }

})

    .controller('howMuchCtrl', function ($scope, authenticationService, $state) {
        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('hOW muCH Controller');

        })
        $scope.GoBack = function () {
            console.log("hOW muCH Controller");
            //$state.go('securitySetting');
        }

    })

       .controller('TransferDetailsCtrl', function ($scope, authenticationService, $state) {
           $scope.$on("$ionicView.enter", function (event, data) {
               console.log('Transfer Details Controller');

           })
           $scope.GoBack = function () {
               console.log("Transfer Details Controller");
               //$state.go('securitySetting');
           }
       })


.controller('notificationCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Notification Controller loaded');
    })

    $scope.GoBack = function () {
        console.log("Back Button Clicked");
        $state.go('app.setting');
    }
});