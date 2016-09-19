angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, $rootScope, $state, $ionicHistory, $cordovaNetwork,
                                             $localStorage, $cordovaGoogleAnalytics, $cordovaGoogleAnalytics,
                                             $ionicPlatform, $ionicContentBanner, $timeout, CommonServices, MemberPrivacy) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        //console.log('Security Settings Screen Loaded');
        //console.log('beforeEnter: isRequiredImmediately ROOTSCOPE: [' + $rootScope.isRequiredImmediately + '], showInSearch: [' + $rootScope.showInSearch + ']');

        $scope.SecSettings = {
            isRequiredImmediately: $rootScope.isRequiredImmediately != null ? $rootScope.isRequiredImmediately : true,
            showInSearch: $rootScope.showInSearch != null ? $rootScope.showInSearch : true
        }
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Security Settings");
        })
    });


    $scope.$on("$ionicView.afterEnter", function (event, data) {

        // CC (9/17/16): Adding this for the case where the user re-opens the app directly to this screen
        // and the $rootScope values don't get set in Menu-Ctrl quick enough for them to be applied above in .beforeEnter()
        $timeout(function () {
            if ($rootScope.isRequiredImmediately != $scope.SecSettings.isRequiredImmediately)
            {
                //console.log('REQUIRE IMMEDIATELY DIDNT MATCH');
                $scope.SecSettings.isRequiredImmediately = $rootScope.isRequiredImmediately;
            }
            if ($rootScope.showInSearch != $scope.SecSettings.showInSearch)
            {
                //console.log('SHOW IN SEARCH DIDNT MATCH');
                $scope.SecSettings.showInSearch = $rootScope.showInSearch;
            }
        }, 700);
    });


    $scope.MemberPrivacyFn = function () {

        //console.log('isRequiredImmediately ROOTSCOPE: [' + $rootScope.isRequiredImmediately + '], showInSearch: [' + $rootScope.showInSearch + ']');
        //console.log('isRequiredImmediately SECSETTINGS: [' + $scope.SecSettings.isRequiredImmediately + '], showInSearch: [' + $scope.SecSettings.showInSearch + ']');

        MemberPrivacy.UpdateSecuritySettings($scope.SecSettings)
            .success(function (data) {
                //console.log(data);

                if (data != null && data.Result != null && data.Result.indexOf('success') > -1)
                {
                    $localStorage.GLOBAL_VARIABLES.isRequiredImmediately = $scope.SecSettings.isRequiredImmediately;
                    $rootScope.isRequiredImmediately = $scope.SecSettings.isRequiredImmediately;
                    $rootScope.showInSearch = $scope.SecSettings.showInSearch;

                    $ionicContentBanner.show({
                        text: ['Settings Updated Successfully!'],
                        autoClose: '4000',
                        type: 'success',
                        transition: 'vertical',
						icon: 'ion-close-circled'
                    });
                }
            })
            .error(function (error) {
                console.log('MemberPrivacySettings Error: [' + JSON.stringify(error) + ']');
                if (error != null && error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
                else if (error != null)
                    CommonServices.DisplayError('Unable to update settings right now :-(');
            });
    }
})
