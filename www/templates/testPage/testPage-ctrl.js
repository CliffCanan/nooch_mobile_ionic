angular.module('noochApp.testPageCtrl', ['noochApp.services'])

 .controller('testPageCtrl', function ($scope, authenticationService, $state) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('History Page Loaded');

        $scope.go = function (data) {
            console.log(data);
            if (data == 'howMuch') {
                $state.go('howMuch');
            }
            else if (data == 'login') {
                $state.go('login');
            }
            else if (data == 'signup') {
                $state.go('signup');
            }
            else if (data == 'TrnsDetails') {
                $state.go('TransferDetails');
            }
            else if (data == 'EnterPin') {
                $state.go('enterPin');
            }
            else if (data == 'recentRecipient') {
                $state.go('recentRecipient');
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


