angular.module('noochApp.welcome', ['noochApp.services'])

    .controller('welcomeCtrl', function ($scope, $state, $rootScope, $localStorage,
                                         $timeout, $ionicLoading, CommonServices, $cordovaGoogleAnalytics, $ionicPlatform) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Welcome Controller Loaded');

            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');

            $ionicPlatform.ready(function () {
                if (typeof analytics !== undefined) analytics.trackView("welcome Controller");                
            })
        });


        $scope.go = function (destination) {
            if (destination == 'profile')
                $state.go('app.profile');
            else
                $state.go('app.home');
        }


        $scope.tellMeMore = function () {
            swal({
                title: "Connect Your Bank",
                text: "<img src='./img/bank_info.png' class='animated fadeIn'/>",
                showCancelButton: true,
                cancelButtonText: "Close",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Complete Now",
                customClass: 'hasImage',
                html: true,
            }, function (isConfirm) {
                if (isConfirm)
                    $state.go('app.profile');
            });
        };

    });