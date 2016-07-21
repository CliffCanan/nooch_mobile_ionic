angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, MemberPrivacy, $state, $ionicHistory, $ionicLoading, $cordovaNetwork) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loaded');
    });


    //$scope.ShowInSearch.isCheck = false;
    $scope.MemberPrivacyFn = function () {

        //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading ...'
            });

            //console.log($scope.ShowInSearch.isCheck);
            //console.log($scope.ShowInSearch.isCheck = ($scope.ShowInSearch.isCheck == false ? true : false)); //to check toggel Button Values 
            //console.log($scope.ShowInSearch.isCheck);

            $scope.ChkBox = {
                RequirePin: true,
                ShowInSearch: true
            };

            console.log($scope.ChkBox.RequirePin, $scope.ChkBox.ShowInSearch);
            MemberPrivacy.MemberPrivacySettings($scope.ChkBox) //.RequirePin, $scope.ChkBox.ShowInSearch
              .success(function (data) {
                  $scope.Data = data;
                  console.log($scope.Data);
                  $ionicLoading.hide();
              }).error(function (data) {
                  console.log('eror' + data);
                  $ionicLoading.hide();
              });
        //}
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }
})