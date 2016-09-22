angular.module('noochApp.securitySettingCtrl', ['noochApp.securitySetting-service', 'noochApp.services'])
/***************************/
/***  SECURITY SETTINGS  ***/
/***************************/
.controller('securitySettingCtrl', function ($scope, $rootScope, $state, $ionicHistory, $cordovaNetwork,
                                             $localStorage, $cordovaGoogleAnalytics, $cordovaGoogleAnalytics, $cordovaTouchID,
                                             $ionicPlatform, $ionicContentBanner, $timeout, CommonServices, MemberPrivacy) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        //console.log('Security Settings Screen Loaded');
        //console.log('beforeEnter: isRequiredImmediately ROOTSCOPE: [' + $rootScope.isRequiredImmediately + '], showInSearch: [' + $rootScope.showInSearch + ']');

        $scope.SecSettings = {
            isRequiredImmediately: $rootScope.isRequiredImmediately != null ? $rootScope.isRequiredImmediately : true,
            showInSearch: $rootScope.showInSearch != null ? $rootScope.showInSearch : true
		}

		$scope.isTouchIdAvailable = CommonServices.checkIfTouchIdAvailable(); // *NOTE: REMOVE "!" WHEN FINISHED TESTING

		if ($scope.isTouchIdAvailable)
		{
	        $scope.SecSettings.touchId = {
				isEnabled: $localStorage.GLOBAL_VARIABLES.touchId.isEnabled,
				login: !$localStorage.GLOBAL_VARIABLES.touchId.isEnabled ? false : $localStorage.GLOBAL_VARIABLES.touchId.requireForLogin,
				payments: !$localStorage.GLOBAL_VARIABLES.touchId.isEnabled ? false : $localStorage.GLOBAL_VARIABLES.touchId.requireForPayments
			}
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
        }, 800);
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
	
	
	$scope.editTouchIdSettings = function (key) {
		// Store the existing settings in case TouchID fails so we can revert back
		// (since the toggle that was tapped has already fired)
		var tempTouchIdSettings = {
			isEnabled: key == 1 ? !$scope.SecSettings.touchId.isEnabled : $scope.SecSettings.touchId.isEnabled,
			login: key == 2 ? !$scope.SecSettings.touchId.login : $scope.SecSettings.touchId.login,
			payments: key == 3 ? !$scope.SecSettings.touchId.payments : $scope.SecSettings.touchId.payments
		}
		//console.log(tempTouchIdSettings);

		if (CommonServices.checkIfTouchIdAvailable())
		{
			$cordovaTouchID.authenticate("Please verify your ID to change this setting.")
				.then(function() {
					if (key == 1)
					{
						var titlePrefix = "En";
						var onOffTxt = "ON";
		
						if (!$scope.SecSettings.touchId.isEnabled)
						{
							titlePrefix = "Dis";
							onOffTxt = "OFF";
			
							// If user disables TouchID entirely, then set the 2 sub-options as False
							$scope.SecSettings.touchId.login = false;
							$scope.SecSettings.touchId.payments = false;
						}
						
			            swal({
			                title: "TouchID " + titlePrefix + "abled",
			                text: "TouchID is now turned " + onOffTxt + " for your Nooch account.",
			                type: "success",
			                customClass: "heavierText singleBtn"
			            });
					}

					$localStorage.GLOBAL_VARIABLES.touchId = {
						isEnabled: $scope.SecSettings.touchId.isEnabled,
						requireForLogin: $scope.SecSettings.touchId.login,
						requireForPayments: $scope.SecSettings.touchId.payments
					}
				}, function (error) {
					console.log(JSON.stringify(error));
					$scope.SecSettings.touchId = tempTouchIdSettings;
				});

			//console.log($scope.SecSettings.touchId);
		}
		else
		{
			CommonServices.DisplayError("TouchID not available!");
			$scope.SecSettings.touchId = tempTouchIdSettings;

			$timeout(function () {
				$('#touchId').addClass('animated zoomOut');
				$timeout(function () {
					$scope.isTouchIdAvailable = false;
				}, 900);
			}, 300);
		}
	}
})
