angular.module('noochApp.socialSettingCtrl', ['noochApp.services'])

.controller('socialSettingCtrl', function ($scope, $rootScope, $state, $ionicHistory, $localStorage, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        //console.log('Social Setting Controller Loadad');

        if ($rootScope.fbid == "")
            $rootScope.fbid = 'not connected';

        $scope.socialSetting = {
            Name: '',
            Email: '',
            Photo: '',
            fbid: $rootScope.fbid,
            fbStatus: ''
        };

        if ($scope.isConnect == null)
			$scope.isConnect = false;
        //console.log($scope.socialSetting.fbid);
	});

    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Social Settings");
        })
    })


    $scope.connectFb = function () {
        //console.log('connectFb Fired');

        if (!window.cordova)
            facebookConnectPlugin.browserInit("738390306293716"); //facebookConnectPlugin.browserInit("198279616971457");

        facebookConnectPlugin.login(['email', 'public_profile'], function (response) {

            console.log('FB Login response: [' + JSON.stringify(response) + ']');
            $scope.fbStatus = _.get(response, 'status');

            facebookConnectPlugin.api("/me?fields=name,email,picture.type(large)", ['email'], function (success) {
                // success
                console.log('got this from fb ' + JSON.stringify(success));

                $scope.socialSetting.Email = _.get(success, 'email');
                $scope.socialSetting.Name = _.get(success, 'name');
                $scope.socialSetting.Photo = _.get(success, 'picture.data.url');
                $scope.socialSetting.fbid = _.get(success, 'id');

                //$scope.$apply();

                if ($scope.fbStatus == 'connected')
                    $scope.isConnect = true;

                authenticationService.SaveMembersFBId($localStorage.GLOBAL_VARIABLES.MemberId, $scope.socialSetting.fbid, $scope.isConnect)
                    .success(function (res) {
                        //console.log('SaveMembersFBId got success res');
                        //console.log(res);
                        if (res.Result == "Success")
	                        $ionicContentBanner.show({
	                            text: ['Facebook Connected Successfully!'],
	                            autoClose: '5000',
	                            type: 'success',
	                            icon: 'ion-close-circled'
	                        });
                    })
                    .error(function (error) {
                        console.log('SaveMembersFBId Error: [' + JSON.stringify(error) + ']');
                        swal("Error", "Something went wrong - please try again or contact Nooch Support to report a bug!", "error");
                    })
            }, function (error) {
                console.log(error);
            });
        });
    }
})
