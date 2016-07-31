angular.module('noochApp.SignupCtrl', ['noochApp.services', 'noochApp.signup-service'])


/******************/
/***  REGISTER  ***/
/******************/
.controller('SignupCtrl', function ($scope, $location, $ionicModal, $ionicLoading, MemberRegistration, $state, CommonServices) {

    $scope.signupData = {
        Name: '',
        Email: '',
        Password: ''
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
                template: 'Sigining in...'
            });

            CommonServices.GetEncryptedData($scope.signupData.Password).success(function (data) {

                $scope.signupData.Password = data.Status;

                MemberRegistration.Signup($scope.signupData).success(function (data) {
                    console.log('Return form Server');
                    console.log(data);

                    $ionicLoading.hide();

                    $state.go('login');

                }).error(function (encError) {
                    console.log('Signup Attempt -> Error [' + encError + ']');
                })
            })
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
})