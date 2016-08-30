angular.module('noochApp.createPinCtrl', ['noochApp.createPin-service', 'noochApp.services'])

    .controller('createPinCtrl', function ($scope, $state, $rootScope, createPinServices, $ionicLoading, CommonServices, authenticationService, $localStorage, $cordovaGeolocation) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Create PIN Controller Loaded');
            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
            else
                $("#pinTxt").focus();
        });

        //console.log($rootScope.signUpData.Pin);
        console.log($rootScope.signUpData);

        $scope.signUpFn = function () {
            console.log('signUpFn called');
            if ($('#frmCreatePin').parsley().validate() == true) {
                console.log($rootScope.signUpData);
                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Loading ...'
                });

                if (($rootScope.signUpData.gotPicUrl == true) && ($rootScope.signUpData.isPicChanged == false)) {
                    console.log('Condition matched now calling thus -> getBase64FromImageUrl');
                    $scope.getBase64FromImageUrl($rootScope.signUpData.Photo); //Convering facebook URL -> Image -> BAse64
                }
               
                CommonServices.GetEncryptedData($rootScope.signUpData.Password).success(function (data) {
                    $rootScope.signUpData.Password = data.Status;
                    //console.log('Pwd Encrypted-->');
                    //console.log($rootScope.signUpData.Password);

                    createPinServices.Signup($rootScope.signUpData).success(function (data) {
                        console.log('Return form Server');
                        console.log(data);
                        $ionicLoading.hide();

                        if (data = 'Thanks for registering! Check your email to complete activation.') {
                            $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
                            $localStorage.GLOBAL_VARIABLES.DeviceId = 'UDID123';
                            $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NOTIF123';
                            $scope.SignIn();
                        }
                        else if (data = 'Duplicate random Nooch ID was generating') {
                            swal("Error", "Email is already registered with nooch", "error");
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
                //    swal("Oops...", "Internet not connected!", "error");
            }
        };


        $scope.SignIn = function () {

            //if ($cordovaNetwork.isOnline())
            //{
            function fetchAfterLoginDetails() {
                $ionicLoading.show({
                    template: 'Reading user details...'
                });

                CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName).success(function (data) {
                    $ionicLoading.hide();

                    if (data != null) {
                        $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;

                        $state.go('app.home');
                    }
                }).error(function (err) {
                    $ionicLoading.hide();
                });
            }

            // place checks here for user location
            // notification permission

            authenticationService.Login($rootScope.signUpData.Email, $rootScope.signUpData.Password, $rootScope.signUpData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
                  $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
                  .success(function (response) {

                      $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;

                      console.log(response.Result + ', ' + response.Result.indexOf('Temporarily_Blocked'));
                      console.log(response);

                      if (response.Result.indexOf('Invalid') > -1 || response.Result.indexOf('incorrect') > -1) {
                          $ionicLoading.hide();
                          swal(response.Result);
                      }
                      else if (response.Result.indexOf('Temporarily_Blocked') > -1) {
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
                              if (isConfirm) {
                              }
                          });
                      }
                      else {
                          $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signUpData.Email;
                          $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
                          $localStorage.GLOBAL_VARIABLES.Pwd = $rootScope.signUpData.Password;
                          $ionicLoading.hide();

                          fetchAfterLoginDetails();
                      }
                  }).error(function (res) {
                      console.log('Login Attempt Error: [' + res + ']');
                  });
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
                console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
                $rootScope.signUpData.Photo = (dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            };
        }
    });
