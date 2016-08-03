angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, authenticationService, $cordovaGoogleAnalytics, $ionicPlatform, profileService, $ionicLoading, $ionicContentBanner, $rootScope) {

   
    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('Home Ctrl loaded');
        $scope.MemberDetails();      

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

    //$scope.$on('IsValidProfileFalse', function (event, args) {  //OverLapping
    //    console.log('IsValidProfileFalse');
    //    //$scope.valid = false;
    //    $scope.contentBannerInstance1();
    //});
    //$scope.contentBannerInstance1 = function () {   //OverLapping
    //    $ionicContentBanner.show({

    //        text: ['Profile Not Validated'],
    //        interval: '20',
    //        autoClose: '',
    //        type: 'error',
    //        transition: 'vertical'
    //    });
    //}



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
        console.log('foundPendingReq');
        $scope.contentBannerInstance2();
    });

    $scope.contentBannerInstance2 = function () {
        $ionicContentBanner.show({

            text: ['Pending Request Waiting'],
            interval: '50',
            autoClose: '',
            type: 'info',
            transition: 'vertical'
        });
    }


        

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})