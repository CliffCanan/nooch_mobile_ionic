angular.module('noochApp.howMuchCtrl', ['noochApp.services'])
/******************/
/***  HOW MUCH  ***/
/******************/
.controller('howMuchCtrl', function ($scope) {
    $scope.$on("$ionicView.enter", function(event, data) {
        console.log('HowMuchCntrl Fired');
    });

    $scope.GoBack = function() {
        console.log("hOW muCH Controller");
        //$state.go('securitySetting');
    };
})
