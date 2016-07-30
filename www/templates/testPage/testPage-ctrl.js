angular.module('noochApp.testPageCtrl', ['ngCordova','noochApp.services'])

 .controller('testPageCtrl', function ($scope, authenticationService, $state, $cordovaContacts) {

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
                $state.go('app.selectRecipient');
            }
            else if (data == 'addPicture') {
                $state.go('addPicture');
            }
            else if (data == 'createPin') {
                $state.go('createPin');
            }
            else if (data == 'enterPinForeground') {
                $state.go('enterPinForeground');
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


