angular.module('noochApp.SettingCtrl', ['noochApp.services'])
/******************/
/***  SETTINGS  ***/
/******************/
 .controller('SettingCtrl', function ($scope, authenticationService, $state) {

     $scope.$on("$ionicView.enter", function (event, data) {
         // On Screen Load

     });

     $scope.go = function (data) {
         if (data == 'Social') {
             $state.go('socialSetting');
         }
         else if (data == 'Notification') {
             $state.go('NotificationSetting');
         }
         else if (data == 'Security') {
             $state.go('securitySetting');
         }
         else if (data == 'profile') {
             $state.go('profile');
         }
     }

 })