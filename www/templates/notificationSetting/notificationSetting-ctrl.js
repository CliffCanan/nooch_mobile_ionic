angular.module('noochApp.notificationSettingCtrl', ['noochApp.services','noochApp.notificationSetting-service'])

.controller('notificationSettingCtrl', function ($scope,CommonServices, $state, notificationServices, $ionicLoading) {

    $scope.ChkBox = {
        EmailTransferReceived: '',
        EmailTransferSent: '',
        TransferReceived: '',
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Notification Controller loaded');
        $scope.GetNotificationFn();
    })
       

    $scope.GetNotificationFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });     

        notificationServices.GetMemberNotificationSettings() 
          .success(function (data) {
              $scope.ChkBox = data;

              //$scope.ChkBox.TransRec = $scope.Data.EmailTransferReceived;
              //$scope.ChkBox.TransSent = $scope.Data.EmailTransferSent;
              //$scope.ChkBox.TransRecMob = $scope.Data.TransferReceived;
             
              console.log($scope.ChkBox);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
            //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
              { CommonServices.logOut(); }
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
        console.log('From Controller -> Values in check boxes');        
        console.log($scope.ChkBox.EmailTransferReceived);
        console.log($scope.ChkBox.EmailTransferSent);
        console.log($scope.ChkBox.TransferReceived);

        notificationServices.MemberEmailNotificationSettings($scope.ChkBox)
          .success(function (data) {
              $scope.Data = data;
              console.log($scope.Data);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
            //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
              { CommonServices.logOut(); }
          });
        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }


})
