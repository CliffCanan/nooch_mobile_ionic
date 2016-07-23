angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services'])
.controller('profileCtrl', function ($scope, CommonServices,profileService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicLoading) {

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

                    //console.log('from testing '+$scope.Details.UserName);
                    //CommonServices.GetDecryptedData($scope.Details.UserName).success(function (data) {
                    //    console.log(data);
                    //   // $scope.Details = data;
                    //}).error(function (encError) {
                    //    console.log('came in enc error block ' + encError);
                    //    $ionicLoading.hide();
                    //})                  

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
})
