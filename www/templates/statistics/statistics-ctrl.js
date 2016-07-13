angular.module('noochApp.StatisticsCtrl', ['noochApp.services'])
/********************/
/***  STATISTICS  ***/
/********************/
.controller('StatisticsCtrl', function ($scope) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Statistics Controller Loaded');
    })
})
