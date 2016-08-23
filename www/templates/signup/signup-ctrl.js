angular.module('noochApp.SignupCtrl', ['noochApp.services', 'noochApp.signup-service'])


/******************/
/***  REGISTER  ***/
/******************/
.controller('SignupCtrl', function ($scope, $location, $ionicModal, $ionicLoading, MemberRegistration, $state, CommonServices, $rootScope, $localStorage, authenticationService) {

    $rootScope.signupData = {
        Name: '',
        Email: '',
        Password: '',
        Photo: '',
        Pin: '',
        rmmbrMe: {
            chk: true
        },
      FBId:''
    };


  $scope.em = '';
  $scope.na = '';



  $scope.gotoSignInPage = function () {
        $location.path("#/login");
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Signup Controller Loaded');
        $scope.getLocation();
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

      console.log('came in sign in with fb');

      if (!window.cordova) {

         facebookConnectPlugin.browserInit("198279616971457"); }

        facebookConnectPlugin.login(['email', 'public_profile'], function (response) {

          console.log('login response from fb ' + JSON.stringify( response));

          facebookConnectPlugin.api("/me?fields=name,email,picture.type(large)", ['email'], function (success) {
            // success
            console.log('got this from fb ' + JSON.stringify(success));

            $rootScope.signupData.Email = _.get(success, 'email');
            $rootScope.signupData.Name = _.get(success, 'name');
            $rootScope.signupData.Photo = _.get(success, 'picture.data.url');
            $rootScope.signupData.FBId = _.get(success, 'id');


            $scope.em = _.get(success, 'email');
            $scope.na = _.get(success, 'name');

            $scope.$apply();

            console.log('Here is my root scope object' + JSON.stringify($rootScope.signupData));

          }, function (error) {
            // error
            console.log(error);
          });


          //    authenticationService.LoginWithFacebookGeneric($localStorage.GLOBAL_VARIABLES.UserName, $scope.FBId, $scope.remmberMe, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude, $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
          //          .success(function (response) {
          //              console.log(response);

          //              if (response.Result == "FBID or EmailId not registered with Nooch") {
          //                  swal("Oops...", "Your Mail or FBID is not registered with nooch", "error");
          //              }
          //              else if (response.Result == "Invalid user id or password.") {
          //                  swal("Oops...", "Invalid user id or password.", "error");
          //              }
          //              else {
          //                  //  $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
          //                  $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;

          //                  $ionicLoading.hide();
          //                  $scope.fetchAfterLoginDetails();

          //                  authenticationService.SaveMembersFBId($localStorage.GLOBAL_VARIABLES.MemberId, $scope.FBId, $scope.fbStatus)
          //                  .success(function (responce) {
          //                      console.log('SaveMembersFBId got success responce');
          //                      console.log(responce);
          //                      $state.go('addPicture');
          //                  }).error(function (responce) {
          //                      console.log('Got an error while saveMemberFBId');
          //                      console.log(responce);
          //                  })
          //              }
          //          }).error(function (res) {
          //              $ionicLoading.hide();
          //              $ionicLoading.hide();
          //              console.log('Login Attempt Error: [' + JSON.stringify(res) + ']');
          //          })
          //},
          //  function (response) {
          //      console.log('error res');
          //      $ionicLoading.hide();
          //      alert(JSON.stringify(response))
        });
      }

      $scope.getLocation = function () {
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = position.coords.latitude
            $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = position.coords.longitude
            console.log('$cordovaGeolocation success -> Lat/Long: [' + lat + ', ' + long + ']');

            $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = true;

          }, function (err) {
            // error
            console.log('$cordovaGeolocation error ' + JSON.stringify(err));
            //Static Loaction in case user denied
            $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '31.33';
            $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '54.33';
            $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
          });
      };

      //$scope.fetchAfterLoginDetails = function () {
      //    $ionicLoading.show({
      //        template: 'Reading user details...'
      //    });
      //    CommonServices.GetMemberIdByUsername($localStorage.GLOBAL_VARIABLES.UserName).success(function (data) {
      //        if (data != null) {
      //            $localStorage.GLOBAL_VARIABLES.MemberId = data.Result;
      //            $ionicLoading.hide();
      //        }
      //    }).error(function (err) {
      //        $ionicLoading.hide();
      //    });
      //}
    })


