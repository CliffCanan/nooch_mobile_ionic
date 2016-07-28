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

        $scope.addBankObj = {
            memberId: $localStorage.GLOBAL_VARIABLES.MemberId,
           // url: $sce.getTrustedResourceUrl('http://nooch.info//noochweb//Nooch//AddBank?MemberId=memberId')
            url : 'http://nooch.info//noochweb//Nooch//AddBank?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId
        };


        console.log('From controller....')
        console.log($scope.addBankObj);
        $ionicLoading.hide();

        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }

})
