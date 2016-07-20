angular.module('noochApp.TransferDetailsCtrl', ['noochApp.services'])


       .controller('TransferDetailsCtrl', function ($scope,$stateParams) {
           $scope.$on("$ionicView.enter", function (event, data) {



               console.log('Transfer Details Controller');
               console.log('oibject -> ' + JSON.stringify($stateParams.myParam));
               $scope.transferDetail = $stateParams.myParam;

           })
           $scope.GoBack = function () {
               console.log("Transfer Details Controller");
               //$state.go('securitySetting');
           }
       })