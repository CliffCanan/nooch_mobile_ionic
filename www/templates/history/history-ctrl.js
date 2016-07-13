angular.module('noochApp.historyCtrl', ['noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/
    .controller('historyCtrl', function($scope) {

        $scope.$on("$ionicView.enter", function(event, data) {

            console.log('History Page Loaded');
        });
    });

