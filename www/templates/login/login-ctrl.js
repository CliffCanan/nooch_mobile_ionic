angular.module('noochApp.LoginCtrl', ['noochApp.login-service', 'noochApp.services', 'ngStorage'])


/***************/
/***  LOGIN  ***/
/***************/
  .controller('LoginCtrl', function ($scope, authenticationService, $state, $ionicLoading, $localStorage, CommonHelper, $cordovaGeolocation, $cordovaDevice, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {
      console.log('Login Controller loaded');
      // swal("Here's a message!");


      if ($localStorage.GLOBAL_VARIABLES) {

        if ($localStorage.GLOBAL_VARIABLES.MemberId) {
          if ($localStorage.GLOBAL_VARIABLES.MemberId.length > 0) {
            $state.go("#/app/home");
          }
          else {
            $state.go("#/login");
          }
        }
      }




      $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude='31.33';
      $localStorage.GLOBAL_VARIABLES.UserCurrentLongi='54.33';
      $localStorage.GLOBAL_VARIABLES.DeviceId='UDID123';
      $localStorage.GLOBAL_VARIABLES.DeviceToken='NOTIF123';

    });

    $scope.loginData = {
      email: 'rick.lassin@gmail.com',
      pwd: 'test123!',
      rmmbrMe: {
        chk: true
      }
    };

    $scope.SignIn = function () {


      if ($('#frmLogin').parsley().validate() == true) {
        $ionicLoading.show({
          template: 'Logging in...'
        });

        // place checks here for user location
        // notification permission


        //password needs to be in encrypted format
        var baseEncodedPassword = btoa($scope.loginData.pwd);

        CommonServices.GetEncryptedData(baseEncodedPassword).success( function (data) {

          console.log('came in success 1');


          authenticationService.Login($scope.loginData.email, data.Status, $scope.loginData.rmmbrMe.chk, $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude,
            $localStorage.GLOBAL_VARIABLES.UserCurrentLongi, $localStorage.GLOBAL_VARIABLES.DeviceId, $localStorage.GLOBAL_VARIABLES.DeviceToken)
            .success(function (response) {
                console.log('came in success 3');


                $scope.loginData.email = '';
                $scope.loginData.pwd = '';
                $scope.loginData.rmmbrMe.val = false;

                console.log(response.Result + ',' + response.Result.indexOf('Temporarily_Blocked'));
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

                  $localStorage.GLOBAL_VARIABLES.UserName = $scope.loginData.email;
                  $localStorage.GLOBAL_VARIABLES.AccessToken = response.Result;
                  $ionicLoading.hide();
                  // swal("login successfull");

                  fetchAfterLoginDetails();
                  // $state.go("#/app/home"); --not working
                }
              }
            ).error(function (res) {
            console.log('came in success 3');

            console.log('came in login error block ' + res);
          });



        }).error(function(encError)
        {
          console.log('came in enc error block ' + encError);
        });


      }
    }


    function fetchAfterLoginDetails() {
      $ionicLoading.show({
        template: 'Reading user details...'
      });


      CommonServices.GetMemberIdByUsername($scope.loginData.email, function (data, error) {

        console.log('response of getmemberId ->' + data);
      });

      $ionicLoading.hide();


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

        if (inputValue === "" || inputValue.length == 0) {
          swal.showInputError("Please enter the email address associated with your account.");
          return false
        }

        if (inputValue.indexOf('@') > 1 &&
          inputValue.indexOf('.') > inputValue.indexOf('@') &&
          inputValue.indexOf('.') < inputValue.length - 2) {
          swal("Success!", "Input email validated, need to submit to sever here. Input was: [" + inputValue + "]", "success");
        }
        else {
          $scope.forgotPw(2)
        }
      });
    }

  })
