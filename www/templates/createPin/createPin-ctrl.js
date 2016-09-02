angular.module('noochApp.createPinCtrl', ['noochApp.createPin-service', 'noochApp.services'])

    .controller('createPinCtrl', function ($scope, $state, $rootScope, createPinServices, $ionicLoading, CommonServices, authenticationService, $localStorage, $cordovaGeolocation, $cordovaSocialSharing) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Create PIN Controller Loaded');
            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
            else
                $("#pinTxt").focus();

            if ($localStorage.GLOBAL_VARIABLES.DeviceToken == '')
                $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NoDevToken';
            else if ($localStorage.GLOBAL_VARIABLES.DeviceToken == null)
                $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NoDevToken';
            else
                console.log($localStorage.GLOBAL_VARIABLES.DeviceToken);
        });

        //console.log($rootScope.signUpData);

        $scope.signUpFn = function () {
            console.log('signUpFn called');

            if ($('#frmCreatePin').parsley().validate() == true)
            {
                console.log($rootScope.signUpData);
                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Creating PIN...'
                });

                if ($rootScope.signUpData.gotPicUrl == true && $rootScope.signUpData.isPicChanged == false)
                {
                    console.log('Condition matched now calling getBase64FromImageUrl');
                    $scope.getBase64FromImageUrl($rootScope.signUpData.Photo); //Convering facebook URL -> Image -> BAse64
                }

                CommonServices.GetEncryptedData($rootScope.signUpData.Password).success(function (data) {
                    $rootScope.signUpData.Password = data.Status;
                    //console.log('Pwd Encrypted-->');
                    //console.log($rootScope.signUpData.Password);

                    createPinServices.Signup($rootScope.signUpData).success(function (data) {
                        console.log(data);

                        $ionicLoading.hide();

                        if (data = 'Thanks for registering! Check your email to complete activation.')
                        {
                            $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
                            console.log('RunTime values ----->> DeviceId And DeviceToken');
                            console.log($localStorage.GLOBAL_VARIABLES.DeviceId);
                            console.log($localStorage.GLOBAL_VARIABLES.DeviceToken);
                            $scope.SignIn();
                        }
                        else if (data = 'Duplicate random Nooch ID was generating')
                        {
                            swal("Uh Oh...", "Email is already registered with nooch", "error");
                            $state.go('signup');
                        }
                        else
                            swal("Error", "Something went wrong", "error");

                    }).error(function (encError) {
                        console.log('Signup Attempt -> Error [' + encError + ']');
                        if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                            CommonServices.logOut();
                    })
                })
                //}
                //else
                //    swal("Error", "Internet not connected!", "error");
            }
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
                      $ionicLoading.hide();

                      if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1)
                          swal("Error", response.Result, "error");
                      else if (response.Result.indexOf('Temporarily_Blocked') > -1)
                      {
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
                  }).error(function (res) {
                      console.log('Login Attempt Error: [' + res + ']');
                  });

            function fetchAfterLoginDetails() {
                $ionicLoading.show({
                    template: 'Grabbing account details...'
                });

                CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName).success(function (data) {
                    $ionicLoading.hide();

                    console.log(data);

                    if (data != null)
                    {
                        $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;

                        $state.go('app.home');
                    }
                }).error(function (err) {
                    $ionicLoading.hide();
                });
            }
            //}
            //else
            //    swal("Oops...", "Internet not connected!", "error");
        }

        $scope.getBase64FromImageUrl = function (URL) {
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
                console.log("Data URL");
                console.log(dataURL);
                console.log("BAse 64--->>");
                //console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
                $rootScope.signUpData.Photo = (dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            };
        }
    });
