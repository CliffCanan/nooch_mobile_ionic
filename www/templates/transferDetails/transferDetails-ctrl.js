angular.module('noochApp.TransferDetailsCtrl', ['noochApp.services'])


       .controller('TransferDetailsCtrl', function ($scope) {
           $scope.$on("$ionicView.enter", function (event, data) {
               console.log('Transfer Details Controller');

           })
           $scope.GoBack = function () {
               console.log("Transfer Details Controller");
               //$state.go('securitySetting');
           }
       })