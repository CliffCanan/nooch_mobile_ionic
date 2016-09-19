angular.module('noochApp.welcome', ['noochApp.services'])

    .controller('welcomeCtrl', function ($scope, $state, $rootScope, $localStorage,
                                         $timeout, $ionicLoading, CommonServices, $cordovaGoogleAnalytics, $ionicPlatform) {

        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            //console.log('Welcome Controller Loaded');

            //console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
        });

        
		$scope.$on("$ionicView.enter", function (event, data) {
            $ionicPlatform.ready(function () {
                if (typeof analytics !== 'undefined') analytics.trackView("Signup Flow - Welcome");
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
                text: "<img src='./img/bank_info.png'/>",
                showCancelButton: true,
                cancelButtonText: "Close",
                confirmButtonText: "Complete Now",
                customClass: "hasImage",
                html: true,
            }, function (isConfirm) {
                if (isConfirm)
                    $state.go("app.profile");
            });
        };

    });