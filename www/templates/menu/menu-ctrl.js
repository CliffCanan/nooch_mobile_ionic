angular.module('noochApp.MenuCtrl', ['noochApp.services'])

.controller('MenuCtrl', function ($scope, authenticationService, $ionicActionSheet) {
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('MenuCtrl ctrl loaded');
    });

    //$scope.settingsClick = function () {
    //    $state.go("app.setting");
    //};

    $scope.showActionSheet = function (id) {

        // Show the correct Action Sheet

        if (id == 'support')
        {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                  { text: 'Report a Bug' },
                  { text: 'Email Nooch Support' },
                  { text: 'View Support Center' }
                ],
                titleText: 'Contact Support',
                cancelText: 'Cancel',
                //cancel: function () {
                //},
                buttonClicked: function (index) {
                    if (index == 0)
                    {

                    }
                    else if (index == 1)
                    {

                    }
                    else if (index == 3)
                    {

                    }

                    return true;
                }
            });
        }
        else if (id == 'legal')
        {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                  { text: 'Terms of Service' },
                  { text: 'Privacy Policy' }
                ],
                titleText: 'Contact Support',
                cancelText: 'Cancel',
                //cancel: function () {
                //},
                buttonClicked: function (index) {
                    if (index == 0)
                    {

                    }
                    else if (index == 1)
                    {

                    }
                    return true;
                }
            });
        }
    };
})
