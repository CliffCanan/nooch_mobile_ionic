angular.module('noochApp.SelectRecipCtrl', ['noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope) {
    $scope.$on("$ionicView.enter", function(event, data) {
        console.log('SelectRecipCtrl Fired');
    });

    $scope.GoBack = function() {
        console.log("hOW muCH Controller");
        //$state.go('securitySetting');
    };
})
