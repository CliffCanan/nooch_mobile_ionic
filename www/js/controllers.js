angular.module('noochApp.controllers', ['noochApp.services'])

    
//Surya Testing Contact plugin
.controller('AccountCtrl', function ($scope, $cordovaContacts, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('History Page Loaded');

        $scope.go = function (data) {
            console.log(data);
            if (data == 'howMuch')
            {
                $state.go('howMuch');
            }
            else if (data == 'login')
            {
                $state.go('login');
            }
            else if (data == 'signup')
            {
                $state.go('signup');
            }
            else if (data == 'TrnsDetails')
            {
                $state.go('TransferDetails');             
            }
        }
        $scope.getContact = function () {
            $cordovaContacts.pickContact().then(function (result) {
                console.log(result);
            });
        }

        $scope.getContacts = function () {
            $cordovaContacts.find({ multiple: true })
                .then(function (result) { console.log(result); });
        }
    })
})
//have to delete after testing 




