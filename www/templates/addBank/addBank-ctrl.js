angular.module('noochApp.addBankCtrl', ['noochApp.services'])

.controller('addBankCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaNetwork) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Add bank Controller loaded');

        $scope.addBankFn();
    })     
    
    $scope.addBankFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;

        $ionicLoading.hide();
        
        
        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }

})
