angular.module('noochApp.referAfriendCtrl', ['noochApp.services'])

 .controller('referAfriendCtrl', function ($scope, authenticationService) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load
         console.log("Refer a friend Controller Loaded");

     });
 })
