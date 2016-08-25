angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform, profileService, $ionicLoading, $ionicContentBanner, $rootScope, selectRecipientService, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('Home Ctrl loaded');

        $scope.isBannerShowing = false;

        $scope.FindRecentFriends();

        $ionicPlatform.ready(function () {

            // $scope.checkUserDetails();
            // console.log($cordovaGoogleAnalytics);
            // $cordovaGoogleAnalytics.debugMode();
            // $cordovaGoogleAnalytics.startTrackerWithId('UA-XXXXXXXX-X');
            // $cordovaGoogleAnalytics.trackView('Home Screen');
        });
    });


    $scope.$on('isSuspended'), function (event, args) {
        $ionicContentBanner.show({
            text: ['! Account Suspended'],
            type: 'error',
            transition: 'vertical'
        });

        $scope.isBannerShowing = true;

        $('#fav-container').css('margin-top', '40px');
    }

    $scope.$on('IsValidProfileFalse', function (event, args) {
        if ($scope.isBannerShowing == false)
        {
            $ionicContentBanner.show({
                text: ['Profile Incomplete'],
                type: 'error',
                transition: 'vertical'
            });

            $scope.isBannerShowing = true;

            $('#fav-container').css('margin-top', '40px');
        }
    });

    $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
        if ($scope.isBannerShowing == false)
        {
            $ionicContentBanner.show({
                text: ['Phone Number Not verified'],
                type: 'error',
                transition: 'vertical'
            });

            $scope.isBannerShowing = true;

            $('#fav-container').css('margin-top', '40px');
        }
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
                if ($scope.memberList[i].Photo == "")
                    $scope.memberList[i].Photo = "./img/profile_picture.png";

                var tmp = [
                  { desc: $scope.memberList[i].FirstName, image: $scope.memberList[i].Photo }
                ];

                $scope.items = $scope.items.concat(tmp);
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
        //else{
        //    swal("Oops...", "Internet not connected!", "error");
        //  }
    }


    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }

})