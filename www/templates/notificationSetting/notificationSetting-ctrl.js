angular.module('noochApp.notificationSettingCtrl', ['noochApp.services','noochApp.notificationSetting-service'])

.controller('notificationSettingCtrl', function ($scope, $state, notificationServices, $ionicLoading) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Notification Controller loaded');
        $scope.GetNotificationFn();
    })

    $scope.ChkBox = {  //Global variables
        TransRec: true, 
        TransSent: true,
        TransUnclaimed: true,
    };

    $scope.GetNotificationFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        //console.log($scope.ChkBox.TransRec);
        //console.log($scope.ChkBox.TransSent);
        //console.log($scope.ChkBox.TransUnclaimed);

        notificationServices.GetMemberNotificationSettings() 
          .success(function (data) {
              $scope.Data = data;
              console.log($scope.Data);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
          });
      //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }


    $scope.SetNotificationFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        console.log($scope.ChkBox.TransRec);
        console.log($scope.ChkBox.TransSent);
        console.log($scope.ChkBox.TransUnclaimed);

        notificationServices.MemberEmailNotificationSettings($scope.ChkBox)
          .success(function (data) {
              $scope.Data = data;
              console.log($scope.Data);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
          });
        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }


})
