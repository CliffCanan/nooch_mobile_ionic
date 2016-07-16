angular.module('noochApp.SignupCtrl', ['noochApp.services'])


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

        if (flag) {
            console.log('signupData ' + JSON.stringify($scope.signupData));
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