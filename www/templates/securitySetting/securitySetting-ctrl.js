angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, MemberPrivacy, $state, $ionicHistory, $ionicLoading, $cordovaNetwork, CommonServices, $localStorage, $cordovaGoogleAnalytics, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Security Settings Screen Loaded');

        $scope.GetMemberPrivacyFn();

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("securitySetting Controller");
        })
    });

    $scope.SecSettings = {
        ShowInSearch: true,
        RequireImmediately: true
    };


    $scope.MemberPrivacyFn = function () {

        //if ($cordovaNetwork.isOnline()) {

        console.log($scope.SecSettings.RequireImmediately, $scope.SecSettings.ShowInSearch);

        MemberPrivacy.UpdateSecuritySettings($scope.SecSettings) //.RequirePin, $scope.SecSettings.ShowInSearch
          .success(function (data) {
              $localStorage.GLOBAL_VARIABLES.isRequiredImmediately = $scope.SecSettings.RequireImmediately;
              $scope.Data = data;
              console.log($scope.Data);
              //$ionicLoading.hide();
          })
		  .error(function (error) {
		      console.log('MemberPrivacySettings Error: [' + JSON.stringify(error) + ']');
		      //$ionicLoading.hide();
		      if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
		          CommonServices.logOut();
		  });
        //}
        //else
        //    swal("Error", "Internet not connected!", "error");
    }



    $scope.GetMemberPrivacyFn = function () {      //For getting Privacy status of user
        console.log("from GetMemberPrivacyFn");
        //if ($cordovaNetwork.isOnline()) {
        //$ionicLoading.show({
        //    template: 'Loading ...'
        //});

        MemberPrivacy.GetMemberPrivacySettings()
              .success(function (data) {
                  console.log(data);
                  $scope.SecSettings = data;
                  //$ionicLoading.hide();
              })
			  .error(function (error) {
			      console.log('GetMemberPrivacySettings Error: [' + JSON.stringify(error) + ']');
			      //$ionicLoading.hide();
			      if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
			          CommonServices.logOut();
			  });
        //}
        //else
        //    swal("Error", "Internet not connected!", "error");

    }
})


