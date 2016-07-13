angular.module('noochApp.resetPwdCtrl', ['noochApp.services'])

/************************/
/***  RESET PASSWORD  ***/
/************************/
.controller('resetPwdCtrl', function ($scope, authenticationService, $state) {
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Reset Pwd Page Is Loaded');

    })
    $scope.GoBack = function () {
        console.log("just Touched in reset pwd Controller");
        $state.go('securitySetting');
    }

})
