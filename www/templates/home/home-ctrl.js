﻿angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform, profileService, $ionicLoading, $ionicContentBanner, $rootScope, selectRecipientService) {


    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('Home Ctrl loaded');
        $scope.FindRecentFriends();

        $ionicPlatform.ready(function () {

            // $scope.checkUserDetails();
            console.log($cordovaGoogleAnalytics);
            $cordovaGoogleAnalytics.debugMode();
            $cordovaGoogleAnalytics.startTrackerWithId('UA-XXXXXXXX-X');
            $cordovaGoogleAnalytics.trackView('APP first screen');

        });
    });

    //$scope.contentBannerInstance = function (msg) {  //Trying to Push Msg @RunTime
    //    $ionicContentBanner.show({

    //        text: msg,
    //        interval: '20',
    //        autoClose: '',
    //        type: 'error',
    //        transition: 'vertical'
    //    });
    //}    

    //(function () {
    //    var message = [];
    //    if (!$scope.valid) message.push('Profile not validated');
    //    if (!$scope.verified) message.push('Phone number not verified');
    //    $scope.contentBannerInstance(message);
    //})()

    $scope.$on('IsValidProfileFalse', function (event, args) {
        console.log('IsValidProfileFalse');
        //$scope.valid = false;
        $scope.contentBannerInstance1();
    });
    $scope.contentBannerInstance1 = function () {
        $ionicContentBanner.show({

            text: ['Profile Not Validated'],
            interval: '20',
            autoClose: '',
            type: 'error',
            transition: 'vertical'
        });
    }



    $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
        console.log('IsVerifiedPhoneFalse');
        //$scope.verified = false;
        $scope.contentBannerInstance();
    });

    $scope.contentBannerInstance = function () {
        $ionicContentBanner.show({

            text: ['Phone Number Not verified'],
            interval: '20',
            autoClose: '4900',
            type: 'error',
            transition: 'vertical'
        });
    }



    $scope.$on('foundPendingReq', function (event, args) {
        //console.log('foundPendingReq');
        $scope.contentBannerInstance2();
    });

    $scope.contentBannerInstance2 = function () {
        $ionicContentBanner.show({

            text: ['Pending Request Waiting'],
            interval: '50',
            autoClose: '3000',
            type: 'info',
            transition: 'vertical'
        });
    }

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }


    $scope.memberList = [];

    $scope.FindRecentFriends = function () { 
        //if ($cordovaNetwork.isOnline())
        //{
        $ionicLoading.show({
            template: 'Loading...'
        });
        selectRecipientService.GetRecentMembers().success(function (data) {

            $scope.memberList = data;
            
            if (data[0] == null) {
                console.log('Got Recent Members Empty, Loading phone contacts ..');

                for (var i = 0; i < $rootScope.phoneContacts.length; i++) {
                    $scope.memberList.push($rootScope.phoneContacts[i]);                    
                }
                console.log('Phone Contacts Are--');
                console.log($scope.memberList);
            }

            console.log('Find recent Fn-->>');
            console.log($scope.memberList);

            $scope.items = [];
            for (var i = 0; i <= 5; i++) {

                if ($scope.memberList[i].Photo == "") {
                    $scope.memberList[i].Photo = "./img/profile_picture.png";
                }

                var tmp = [
                  { desc: $scope.memberList[i].FirstName, image: $scope.memberList[i].Photo }
                ];
                $scope.items = $scope.items.concat(tmp);
            };


            $ionicLoading.hide();

        }).error(function (data) { console.log(data); $ionicLoading.hide(); });
        //}
        //else{
        //    swal("Oops...", "Internet not connected!", "error");
        //  }
    }

})