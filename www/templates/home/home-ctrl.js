angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, $cordovaGoogleAnalytics, $ionicPlatform, $timeout,
                                  $ionicLoading, $ionicContentBanner, $rootScope, $localStorage,
                                  authenticationService, profileService, selectRecipientService, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('Home Ctrl Loaded');

        $scope.shouldDisplayErrorBanner = false;
        $scope.errorBannerTextArray = [];

        $timeout(function () {
            //console.log($localStorage.GLOBAL_VARIABLES);

            if ($rootScope.IsPhoneVerified == false)
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Phone Number Not Verified');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.isProfileComplete == false ||
                $rootScope.Status === "Registered")
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Profile Not Complete');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.Status === "Suspended" ||
                $rootScope.Status === "Temporarily_Blocked")
            {
                $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.hasSynapseBank == false)
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Missing Bank Account');
                $scope.shouldDisplayErrorBanner = true;
            }

            if ($scope.shouldDisplayErrorBanner)
            {
                $ionicContentBanner.show({
                    text: $scope.errorBannerTextArray,
                    interval: '4000',
                    type: 'error',
                    transition: 'vertical'
                });

                $scope.isBannerShowing == true;
                $('#fav-container').css('margin-top', '40px');
            }
            else
                $scope.isBannerShowing == false;

            if ($localStorage.GLOBAL_VARIABLES.MemberId != null &&
                $localStorage.GLOBAL_VARIABLES.MemberId != '')
                $scope.FindRecentFriends();

        }, 1000);

        $ionicPlatform.ready(function () {
            // console.log($cordovaGoogleAnalytics);
            // $cordovaGoogleAnalytics.debugMode();
            // $cordovaGoogleAnalytics.startTrackerWithId('UA-XXXXXXXX-X');
            // $cordovaGoogleAnalytics.trackView('Home Screen');
        });
    });


    $scope.$on('foundPendingReq', function (event, args) {
        if ($scope.isBannerShowing == false)
        {
            $ionicContentBanner.show({
                text: ['Pending Request Waiting'],
                type: 'info',
                transition: 'vertical'
            });

            $scope.isBannerShowing = true;

            $('#fav-container').css('margin-top', '40px');
        }
    });


    $scope.memberList = [];


    $scope.FindRecentFriends = function () {
        //if ($cordovaNetwork.isOnline())
        //{
        $ionicLoading.show({
            template: 'Loading...'
        });

        selectRecipientService.GetRecentMembers().success(function (data) {

            $scope.memberList = data;

            if (data[0] == null)
            {
                console.log('Got Recent Members Empty, Loading phone contacts ..');

                for (var i = 0; i < $rootScope.phoneContacts.length; i++)
                {
                    $scope.memberList.push($rootScope.phoneContacts[i]);
                }
                console.log('Phone Contacts Are...');
                console.log($scope.memberList);
            }

            console.log('GetRecentMembers()-->>');
            console.log($scope.memberList);

            $scope.items = [];

            for (var i = 0; i <= 4; i++)
            {
                if (i < $scope.memberList.length)
                {
                    if ($scope.memberList[i].Photo == null || $scope.memberList[i].Photo == "")
                        $scope.memberList[i].Photo = "./img/profile_picture.png";

                    var tmp = [
                      { desc: $scope.memberList[i].FirstName, image: $scope.memberList[i].Photo }
                    ];

                    $scope.items = $scope.items.concat(tmp);
                }
            };

            $ionicLoading.hide();

        }).error(function (data) {
            console.log(data);
            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                CommonServices.logOut();
        })

        //.finally(function () {   will be used when ll be dealing with pull to refresh
        //    // Stop the ion-refresher from spinning
        //    $scope.$broadcast('scroll.refreshComplete');
        //});
        //}
        //else
        //    swal("Oops...", "Internet not connected!", "error");
    }


    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }

})