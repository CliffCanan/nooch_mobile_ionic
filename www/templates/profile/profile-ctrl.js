angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services', 'ngCordova'])
.controller('profileCtrl', function ($scope, CommonServices, profileService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicLoading, $cordovaDatePicker) {
     

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
        $scope.MemberDetails();

    })

    $scope.MemberDetails = function () {
        console.log('memberDetails Function Touched');
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        profileService.GetMyDetails()
                .success(function (details) {
                    console.log(details);
                    $scope.Details = details;                                

                    $ionicLoading.hide();
                }
        ).error(function (encError) {
            console.log('came in enc error block ' + encError);
            $ionicLoading.hide();
        })  
       
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }



    $scope.UpdateProfile = function () {
        console.log('Update Profile Function Touched');
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

      //console.log('Values from Profile.html Page...');       
      //console.log($scope.Details);
      
        profileService.MySettings($scope.Details)
            .success(function (data) {
                console.log(data);
                $scope.Data = data;
                $ionicLoading.hide();
            }
    ).error(function (encError) {
        console.log('came in enc error block ' + encError);
        $ionicLoading.hide();
    })
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }

     //date Picker 

    $scope.showdate = function () {
        
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: 0,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };       
        
        document.addEventListener("deviceready", function () {
            
            $cordovaDatePicker.show(options).then(function (date) {
              //  alert(date);
                $scope.Details.DateOfBirth = date;
            });

        }, false);

    } 
  
})
