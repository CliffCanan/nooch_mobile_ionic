angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


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
        console.log('foundPendingReq');
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

    $scope.FindRecentFriends = function () {  //Use Network check plugin
        $ionicLoading.show({
            template: 'Loading ...'
        });
        selectRecipientService.GetRecentMembers().success(function (data) {

            $scope.memberList = data;

            console.log('Find recent Fn-->>');
            console.log($scope.memberList);
            console.log($scope.memberList[0].Photo);                        

  $scope.items = [];
  for (var i = 0; i <= 5; i++) {

      //console.log('memberList Values are =----->>');
      //console.log($scope.memberList);

        var tmp = [
          { desc: $scope.memberList.FirstName, image: $scope.memberList.Photo },
          { desc: 'The Beatles', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTGpH07f9zeucoOs_stZyIFtBncU-Z8TDYmJgoFnlnxYmXjJEaitmxZNDkNvYnCzwWTySM' },
          { desc: 'Pink Floyd', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT-FbU5dD_Wz472srRIvoZAhyGTEytx9HWGusbhYgSc2h0N6AqqRrDwzApmyxZoIlyxDcU' },
          { desc: 'The Rolling Stones', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6uwPPBnHfAAUcSzxr3iq9ou1CZ4f_Zc2O76i5A4IyoymIVwjOMXwUFTGSrVGcdGT9vQY' },
          { desc: 'The Jimi Hendrix Experience', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRA3jz0uhVypONAKWUve80Q6HASvuvZiohl4Sru5ZihkAsjWiaGjocfxd0aC3H7EeFk5-I' },
          { desc: 'Van Halen', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRIslVN9cJJ6YuV0y7JihAyA63JDhXGhkCVxHIRE-IoaF-rpefjIXO5osA24QvN9iCptC8' }
        ];
        $scope.items = $scope.items.concat(tmp);
    };


  $ionicLoading.hide();

        }).error(function (data) { console.log(data); $ionicLoading.hide(); });
    }

})