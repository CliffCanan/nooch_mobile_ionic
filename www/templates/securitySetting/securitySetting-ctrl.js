angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, MemberPrivacy, $state, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loaded');
    });

    
    //$scope.ShowInSearch.isCheck = false;
    $scope.MemberPrivacyFn = function () {

        //console.log($scope.ShowInSearch.isCheck);
        //console.log($scope.ShowInSearch.isCheck = ($scope.ShowInSearch.isCheck == false ? true : false)); //to check toggel Button Values 
        //console.log($scope.ShowInSearch.isCheck);

        $scope.SecurityData = {           
            RequirePin: {
                chk: true
            },
            ShowInSearch: {
                chk:true
            }
        };
        console.log($scope.SecurityData.RequirePin.chk, $scope.SecurityData.ShowInSearch.chk    );
        MemberPrivacy.MemberPrivacySettings($scope.SecurityData.RequirePin.chk, $scope.SecurityData.ShowInSearch.chk)
          .success(function (data) {
              $scope.Data = data;
              console.log($scope.Data);
              //  $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
          });
    }
})