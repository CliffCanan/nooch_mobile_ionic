angular.module('noochApp.welcome', ['noochApp.services'])

    .controller('welcomeCtrl', function ($scope, $state, $rootScope, $localStorage,
                                         $timeout, $ionicLoading, CommonServices) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Welcome Controller Loaded');

            console.log($rootScope.signUpData);

            //if ($rootScope.signUpData == null)
                //$state.go('signup');
        });


		$scope.go = function(destination)
		{
			if (destination == 'profile')
				$state.go('app.profile');
			else
				$state.go('app.home');
		}


        $scope.tellMeMore = function () {
            console.log('tellMeMore Fired');

            swal({
                title: "Connect Your Bank",
                text: "<img src='./img/bank_info.png' />",
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