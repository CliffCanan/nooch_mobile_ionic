angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, MemberPrivacy, $state, $ionicHistory, $ionicLoading, $cordovaNetwork, CommonServices, $localStorage) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loaded');

        $scope.GetMemberPrivacyFn();
    });

    $scope.ChkBox = {
        RequireImmediately: true,
        ShowInSearch: true
    };


    //$scope.ShowInSearch.isCheck = false;
    $scope.MemberPrivacyFn = function () {

        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        //console.log($scope.ShowInSearch.isCheck);
        //console.log($scope.ShowInSearch.isCheck = ($scope.ShowInSearch.isCheck == false ? true : false)); //to check toggel Button Values 
        //console.log($scope.ShowInSearch.isCheck);

        console.log($scope.ChkBox.RequireImmediately, $scope.ChkBox.ShowInSearch);
        MemberPrivacy.MemberPrivacySettings($scope.ChkBox) //.RequirePin, $scope.ChkBox.ShowInSearch
          .success(function (data) {
              $localStorage.GLOBAL_VARIABLES.EnterPinImmediately = $scope.ChkBox.RequireImmediately;
              console.log($localStorage.GLOBAL_VARIABLES.EnterPinImmediately);
              $scope.Data = data;
              console.log($scope.Data);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
              // if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
              { CommonServices.logOut(); }
          });
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }



    $scope.GetMemberPrivacyFn = function () {      //For getting Privacy status of user
        console.log("from GetMemberPrivacyFn");
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

        MemberPrivacy.GetMemberPrivacySettings()
              .success(function (data) {
                  $scope.ChkBox = data;
                  console.log($scope.ChkBox);
                  $ionicLoading.hide();
              }).error(function (data) {
                  console.log('eror' + data);
                  $ionicLoading.hide();
                  //   if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                  { CommonServices.logOut(); }
              });
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}

    }
})


