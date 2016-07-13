angular.module('noochApp.securitySettingCtrl', ['noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loadad');
    })

    $scope.GoBack = function () {
        $state.go('app.setting');
    }

    $scope.goo = function () {
        console.log("Entered in Security Setting Controller");
        $state.go('ResetPwd');
    }
})
