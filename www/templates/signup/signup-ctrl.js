angular.module('noochApp.SignupCtrl', ['noochApp.services', 'noochApp.signup-service'])

.controller('SignupCtrl', function ($scope, $location, $ionicModal, $ionicLoading, $timeout, MemberRegistration,
									$state, CommonServices, $rootScope, $localStorage, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform) {

    $rootScope.signUpData = {
        FirstName: '',
        Name: '',
        Email: '',
        Password: '',
        Photo: '',
        Pin: '',
        rmmbrMe: {
            chk: true
        },
        FBId: '',
        FbPicUrl: ''
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Signup Controller Loaded');
        console.log('signUpData: [' + JSON.stringify($rootScope.signUpData) + ']');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Signup / Register");
        })
    });


    $scope.signUpClick = function () {

        if ($rootScope.signUpData.Name.indexOf(" ") == -1)
        {
            swal({
                title: "Need a Full Name",
                text: "For security, we ask all Nooch users to sign up with a full name (first and last).",
                type: "warning",
                customClass: "singleBtn"
            }, function () {
                $('#nameField').focus();
            });
        }
        else if ($scope.checkStringForNumber($rootScope.signUpData.Name) == true)
        {
            swal({
                title: "Really?",
                text: "Your name has a number in it?" +
                      "<span class='show'>Please enter a real name.</span>" +
                      "<span class='show'>Or if your name actually does contain a number, our bad... please contact support@nooch.com and we'll create an account for you.</span>",
                type: "warning",
                html: true,
                customClass: "singleBtn"
            }, function () {
                $('#nameField').focus();
            });
        }
        else if ($scope.checkStringForSymbol($rootScope.signUpData.Name) == true)
        {
            swal({
                title: "Really?",
                text: "Your name has a symbol in it?" +
                      "<span class='show'>Please enter a real name.</span>" +
                      "<span class='show'>Or if your name actually does contain a symbol, our apologies... please contact support@nooch.com and we'll create an account for you.</span>",
                type: "warning",
                html: true,
                customClass: "singleBtn"
            }, function () {
                $('#nameField').focus();
            });
        }
        else if ($('#email').parsley().validate() != true)
        {
            swal({
                title: "Hmmm...",
                text: "Please double check that you entered a valid email address!",
                type: "warning",
                customClass: "singleBtn"
            }, function () {
                $('#email').focus();
            });
        }
        else if ($scope.checkStringForNumber($rootScope.signUpData.Password) == false)
        {
            swal({
                title: "Insecure Password",
                text: "To protect your account, we ask that passwords contain at least 1 number." +
                      "<span class='show'>We know it's annoying, but you can't put a price on safety, right?</span>",
                type: "warning",
                html: true,
                customClass: "singleBtn"
            }, function () {
                $('#pwField').focus();
            });
        }
        else if ($rootScope.signUpData.Password.match(/[A-Z]+/ig) == null)
        {
            swal({
                title: "Insecure Password",
                text: "Regrettably, your Nooch password must contain 1 actual letter!",
                type: "warning",
                customClass: "singleBtn"
            }, function () {
                $('#pwField').focus();
            });
        }
        else if ($('#ckBox').parsley().validate() != true)
        {
            swal({
                title: "Who Loves Lawyers?",
                text: "Please read Nooch's Terms of Service. <small class='show m-b-20'>(They're definitely as exciting as you think.)</span>",
                type: "warning",
                confirmButtonText: "View TOS",
                showCancelButton: true,
                cancelButtonText: "Ok",
                html: true
            }, function (isConfirm) {
                if (isConfirm)
                    $scope.openTos();
            });
        }
        else
        {
            //console.log($rootScope.signUpData);

            $state.go('addPicture');
        }
    };

    $scope.checkStringForNumber = function (str) {
        var match = str.match(/\d+/g);
        if (match != null)
            return true;
        return false;
    }

    $scope.checkStringForSymbol = function (str) {
        var match = str.replace(' ', '') // Don't count the 1st " " for b/t first/last name
                       .replace('\'', '') // Don't count ' because some names have an apostrophe
                       .replace(' ', '') // In case the person inputs 3 names (i.e. "Michael Jack Schmidt"), don't count the 2nd " "
                       .match(/\W+/);
        if (match != null)
            return true;
        return false;
    }


    // Viewing TOS Webview (in an Ionic Modal)
    $ionicModal.fromTemplateUrl('tosModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.tosModal = modal;
    });

    $scope.openTos = function () {
        $scope.tosModal.show();
    };

    $scope.closeTos = function () {
        $scope.tosModal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.tosModal.remove();
    });


    $scope.SignUpWithFB = function () {

        console.log('came in sign in with fb');

        if (!window.cordova)
            facebookConnectPlugin.browserInit("198279616971457");

        facebookConnectPlugin.login(['email', 'public_profile'], function (response) {

            console.log('login response from fb ' + JSON.stringify(response));

            facebookConnectPlugin.api("/me?fields=name,email,picture.type(large)", ['email'], function (success) {
                // success
                console.log('got this from fb ' + JSON.stringify(success));

                $rootScope.signUpData.Email = _.get(success, 'email');
                $rootScope.signUpData.Name = _.get(success, 'name');
                $rootScope.signUpData.FbPicUrl = _.get(success, 'picture.data.url');
                $rootScope.signUpData.FBId = _.get(success, 'id');

                $scope.$apply();
                console.log('signUpData: ' + JSON.stringify($rootScope.signUpData));
            }, function (error) {
                console.log(error);
                CommonServices.DisplayError('Unable to connect with Facebook :-(');
            });
        });
    }


    $scope.keyEntered = function (btn) {

        if (btn == 1)
        {
            var fName = $rootScope.signUpData.Name;

            if (fName.length > 4 && fName.indexOf(' ') > 0)
            {
                var nameArray = $rootScope.signUpData.Name.split(" ");
                $rootScope.signUpData.FirstName = nameArray[0];
            }
        }
        else // Remove whitespace from the name (only when on another input so user can enter a " " b/t first/last name
            $('#nameField').val($('#nameField').val().trim());

        if ($('#email').val().length > 5) // trim the email whenever the user has entered 5 chars
            $('#email').val($('#email').val().trim());

        if ($rootScope.signUpData.Name.length > 3 &&
            $rootScope.signUpData.Email.length > 3 &&
            $rootScope.signUpData.Password.length > 4)
            $('#createAccount').attr('disabled', false);
        else
            $('#createAccount').attr('disabled', true);
    }


    $scope.checkIfEmailAlreadyRegistered = function () {
        console.log('checkIfEmailAlreadyRegistered Fired');

        var isEmailValid = $('#email').parsley().validate();

        if (isEmailValid == true)
        {
            console.log("Checking Email with server...");
            MemberRegistration.CheckIfEmailIsRegistered($rootScope.signUpData.Email).success(function (data) {

                console.log(data);

                if (data != null && data.matchFound == true)
                {
                    $localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled = data.rememberMe == true ? true : false;

                    swal({
                        title: "Email Already Registered",
                        text: "Terribly sorry, but it looks like <strong>" + $rootScope.signUpData.Email + "</strong> has already been registered!" +
                              "<span class='show'>If this is your account, click 'Login' to, well, login!</span>",
                        type: "error",
                        showCancelButton: true,
                        cancelButtonText: "Login",
                        html: true,
                    }, function (isConfirm) {
                        console.log(isConfirm);
                        if (!isConfirm)
                        {
                            $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
                            $state.go('login');
                        }
                    });
                }
            }).error(function (err) {
                $ionicLoading.hide();
            });
        }
    }


    $scope.goToLogin = function () {
        $('#toLoginBtn').addClass('bounceOutRight');

        $timeout(function () {
            $state.go('login');

            $timeout(function () {
                $('#toLoginBtn').removeClass('bounceOutRight');
            }, 500);
        }, 400);
    }


    $scope.getBase64FromImgUrl = function (URL) {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = URL;
        img.onload = function () {

            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            //console.log("Data URL...");
            //console.log(dataURL);
            $rootScope.signUpData.Photo = (dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
        };
    }
})