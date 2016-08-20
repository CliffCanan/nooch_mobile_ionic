angular.module('noochApp.SignupCtrl', ['noochApp.services', 'noochApp.signup-service'])


/******************/
/***  REGISTER  ***/
/******************/
.controller('SignupCtrl', function ($scope, $location, $ionicModal, $ionicLoading, MemberRegistration, $state, CommonServices,$rootScope) {

    $rootScope.signupData = {
        Name: '',
        Email: '',
        Password: '',
        Photo: '',
        Pin: '',
        rmmbrMe: {
            chk: true
        }
    };

    $scope.gotoSignInPage = function () {
        $location.path("#/login");
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Signup Controller Loaded');

        console.log('signupData ' + JSON.stringify($scope.signupData));
    });


    $scope.signUpClick = function () {

        var isFormValid = $('#submitForm').parsley().validate();

        if (isFormValid)
        {
            console.log('signupData ' + JSON.stringify($scope.signupData));
            $ionicLoading.show({
                template: 'Creating Account...'
            });     

            
            $rootScope.signupData.Email;
            $rootScope.signupData.Name;
            $rootScope.signupData.Password;

            console.log('From signup page');
            console.log($rootScope.signupData);
            $state.go('addPicture');
            $ionicLoading.hide();

            //CommonServices.GetEncryptedData($scope.signupData.Password).success(function (data) {
            //    $scope.signupData.Password = data.Status;
            //    MemberRegistration.Signup($scope.signupData).success(function (data) {
            //        console.log('Return form Server');
            //        console.log(data);

            //        $ionicLoading.hide();

            //        $state.go('addPicture');

            //    }).error(function (encError) {
            //        console.log('Signup Attempt -> Error [' + encError + ']');
            //    })
            //})
        }
    };

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

        $scope.fbResult = {
            authResponse: {
                userID: '',
                accessToken: '',
                session_Key: '',
                expiresIn: '',
                sig: ''
            },
            status: ''
        }

        $ionicLoading.show({
            template: 'Loading ...'
        });
        console.log('came in sign in with fb');

        if (!window.cordova)
        { facebookConnectPlugin.browserInit("198279616971457"); }

        facebookConnectPlugin.login(['email', 'public_profile'], function (response) {

            console.log(response);
            //  var a = JSON.stringify(response);
            //console.log('stringfied auth ' + JSON.stringify( a.authResponse));
            //console.log('a val ' + _.get(response, 'authResponse.accessToken'));
            // $scope.FBId = _.get(response, 'authResponse.accessToken');
            $scope.fbResult = response;
            console.log($scope.fbResult);

            //Getting Reay for service Call
            $localStorage.GLOBAL_VARIABLES.UserName = 'suryaprakash9@hotmail.com';
            $scope.FBId = _.get(response, 'authResponse.userID');
            console.log($scope.FBId);
            $scope.remmberMe = true;
            //$scope.deviceId = 'UDID123';
            //$scope.deviceToken = 'SPC123';
            $scope.fbStatus = _.get($scope.fbResult, 'status');
            $localStorage.GLOBAL_VARIABLES.AccessToken = _.get(response, 'authResponse.accessToken');

            if ($scope.fbStatus == 'connected')
                $scope.fbStatus = 'YES';

            console.log('After replacing the values of FB Status');
            console.log($scope.fbStatus);
            // alert(JSON.stringify(response));
            console.log('fb Connect Success');

            authenticationService.LoginWithFacebookGeneric($localStorage.GLOBAL_VARIABLES.UserName, $scope.FBId, $scope.remmberMe, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude, $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
                  .success(function (response) {
                      console.log(response);

                      if (response.Result == "FBID or EmailId not registered with Nooch") {
                          swal("Oops...", "Your Mail or FBID is not registered with nooch", "error");
                      }
                      else if (response.Result == "Invalid user id or password.") {
                          swal("Oops...", "Invalid user id or password.", "error");
                      }
                      else {
                          //  $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
                          $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;

                          $ionicLoading.hide();
                          $scope.fetchAfterLoginDetails();

                          authenticationService.SaveMembersFBId($localStorage.GLOBAL_VARIABLES.MemberId, $scope.FBId, $scope.fbStatus)
                          .success(function (responce) {
                              console.log('SaveMembersFBId got success responce');
                              console.log(responce);
                              $state.go('app.home');
                          }).error(function (responce) {
                              console.log('Got an error while saveMemberFBId');
                              console.log(responce);
                          })
                      }
                  }).error(function (res) {
                      $ionicLoading.hide();
                      $ionicLoading.hide();
                      console.log('Login Attempt Error: [' + JSON.stringify(res) + ']');
                  })
        },
          function (response) {
              console.log('error res');
              $ionicLoading.hide();
              alert(JSON.stringify(response))
          });
    }

})