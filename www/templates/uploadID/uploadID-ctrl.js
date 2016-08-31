angular.module('noochApp.uploadIDCtrl', ['noochApp.uploadID-service', 'noochApp.services'])

       .controller('uploadIDCtrl', function ($scope, $ionicLoading, $ionicPlatform) {

           $scope.$on("$ionicView.enter", function (event, data) {

               console.log('uloadID Ctrl loaded');
           })

       })