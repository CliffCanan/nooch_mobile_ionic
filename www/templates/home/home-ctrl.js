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


    $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
        console.log('phone is falsee');
       $scope.contentBannerInstance();
    });

    $scope.contentBannerInstance = function () {
        $ionicContentBanner.show({

            text: ['Phone Number Not verified','Please verify Your phone - respond Go to the SMS'],
            interval: '20',
            autoClose: '',
            type: 'error',
            transition: 'vertical'
        });
    }


    $scope.MemberDetails = function () {
        console.log('MemberDetails Function Fired');        

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading Details...'
        });

        profileService.GetMyDetails()
                .success(function (details) {
                  
                    $scope.Details = details;
                   
                    console.log('values in  Details');
                    console.log($scope.Details);                    

                    if ($scope.Details.IsVerifiedPhone == false)
                    {
                        console.log('values IsVerifiedPhone');
                        console.log($scope.Details.IsVerifiedPhone);                                           
                        $rootScope.$broadcast('IsVerifiedPhoneFalse');                                            

                    }

                    //if ($scope.Details.IsValidProfile == false) {
                    //    console.log($scope.Details.IsValidProfile);
                    //    console.log('values are up there');
                    //    $rootScope.$broadcast('IsValidProfileFalse');
                    //}

                    $ionicLoading.hide();
                })
                .error(function (encError) {
                    console.log('Profile Error: [' + encError + ']');
                    $ionicLoading.hide();
                })

        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }
       
     

    $scope.goToSelectRecip = function () {
        $state.go('app.selectRecipient');
    }
 
})