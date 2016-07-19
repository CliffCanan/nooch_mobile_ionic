angular.module('noochApp.SignupCtrl', ['noochApp.services', 'noochApp.signup-service'])


/******************/
/***  REGISTER  ***/
/******************/
.controller('SignupCtrl', function ($scope, $location, $ionicModal, $ionicLoading, MemberRegistration, $state) {

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
            $ionicLoading.show({
                template: 'Sigining in...'
            });
            
            MemberRegistration.Signup($scope.signupData).success(function (data) {
                console.log('Return form Server');
                console.log(data);
                $ionicLoading.hide({
                   
                });
                swal("Signup successfull")
                $state.go('login');
             
            }).error(function (encError) {
                console.log('came in enc error block ' + encError);

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