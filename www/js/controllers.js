angular.module('starter.controllers', [])
    .controller('LoginCtrl', function ($scope) {

        $scope.$on("$ionicView.enter", function (event, data) {
            // handle event
            console.log('Login Controller loaded');
            swal("Here's a message!");
        });

        
    });