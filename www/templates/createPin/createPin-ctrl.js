angular.module('noochApp.createPinCtrl', ['noochApp.createPin-service', 'noochApp.services'])

    .controller('createPinCtrl', function ($scope, $state, $rootScope, createPinServices, $ionicLoading, CommonServices, authenticationService, $localStorage) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

            //$("#pin").focus();
            console.log('form  Create Pin Page..');
            console.log($rootScope.signupData);
        });

        //console.log($rootScope.signupData.Pin);
        console.log($rootScope.signupData);

        $scope.signUpFn = function () {
            console.log('signUpFn called');
            if ($('#frmCreatePin').parsley().validate() == true) {
                console.log($rootScope.signupData);

                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Loading ...'
                });


                CommonServices.GetEncryptedData($rootScope.signupData.Password).success(function (data) {
                    $rootScope.signupData.Password = data.Status;
                    console.log('After replacing Root Scope value is--');
                    console.log($rootScope.signupData.Password);
                    
                    createPinServices.Signup($rootScope.signupData).success(function (data) {
                        console.log('Return form Server');
                        console.log(data);
                        $ionicLoading.hide();

                        if (data = 'Thanks for registering! Check your email to complete activation.')
                        {                           

                            $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signupData.Email;
                            $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '31.33';
                            $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '54.33';
                            $localStorage.GLOBAL_VARIABLES.DeviceId = 'UDID123';
                            $localStorage.GLOBAL_VARIABLES.DeviceToken = 'NOTIF123';
                            $scope.SignIn();                           

                        }
                        else if (data = 'Duplicate random Nooch ID was generating')
                        {
                            swal("Oops...", "Email is already registered with nooch", "error");
                            $state.go('signup');
                        }
                        else {
                            swal("Oops...", "Something went wrong", "error");
                        }
                 

                    }).error(function (encError) {
                        console.log('Signup Attempt -> Error [' + encError + ']');
                    })
                })

                //}
                //else {
                //    swal("Oops...", "Internet not connected!", "error");
                //}
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
                       
                        $rootScope.signupData = {
                            Name: '',
                            Email: '',
                            Password: '',
                            Picture: '',
                            Pin: '',
                            rmmbrMe: {
                                chk: true
                            }
                        };
                        $state.go('app.home'); 
                    }

                }).error(function (err) {
                    $ionicLoading.hide();
                });
            }
          
                // place checks here for user location
                // notification permission
          

                authenticationService.Login($rootScope.signupData.Email, $rootScope.signupData.Password, $rootScope.signupData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
                      $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
                      .success(function (response) {

                          $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signupData.Email;

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
                              $localStorage.GLOBAL_VARIABLES.UserName = $rootScope.signupData.Email;
                              $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
                              $localStorage.GLOBAL_VARIABLES.Pwd = $rootScope.signupData.Password;
                              $ionicLoading.hide();                           

                              fetchAfterLoginDetails();
                              
                          }
                      }
                      ).error(function (res) {
                          console.log('Login Attempt Error: [' + res + ']');
                      });            

         
            //}
            //else{
            //    swal("Oops...", "Internet not connected!", "error");
            //  }
        }      
    });
