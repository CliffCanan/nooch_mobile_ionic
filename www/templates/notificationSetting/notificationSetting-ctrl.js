angular.module('noochApp.notificationSettingCtrl', ['noochApp.services', 'noochApp.notificationSetting-service'])

.controller('notificationSettingCtrl', function ($scope, $rootScope, $ionicPlatform, $ionicLoading, $state, $cordovaGoogleAnalytics,
												 $ionicContentBanner, CommonServices, notificationServices) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        if ($rootScope.ChkBox == null)
        {
            $rootScope.ChkBox = {
                EmailTransferReceived: '',
                EmailTransferSent: '',
                TransferReceived: '',
            };
        }

        $scope.GetNotificationFn();
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Notification Settings");
        })
    })


    $scope.GetNotificationFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        //$ionicLoading.show({
        //    template: 'Loading Settings...'
        //});

        notificationServices.GetMemberNotificationSettings()
            .success(function (data) {
                console.log(data);
                $rootScope.ChkBox = data;
                //$ionicLoading.hide();
            })
            .error(function (error) {
                console.log('GetMemberNotificationSettings Error: [' + error + ']');
                //$ionicLoading.hide();
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        //  }
        //else
        //    swal("Error", "Internet not connected!", "error");     
    }


    $scope.SetNotificationFn = function () {
        //if ($cordovaNetwork.isOnline()) {

        notificationServices.MemberEmailNotificationSettings($rootScope.ChkBox)
            .success(function (data) {
                console.log(data);
				
				if (data.Result != null && data.Result =="Success")
	                $ionicContentBanner.show({
	                    text: ['Notification Settings Updated Successfully!'],
	                    autoClose: '3000',
	                    type: 'success',
	                    transition: 'vertical',
	                    icon: 'ion-close-circled'
	                });
            })
            .error(function (data) {
                console.log('MemberEmailNotificationSettings Error: [' + JSON.stringify(data) + ']');
                $ionicLoading.hide();
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        //  }
        //else
        //    swal("Error", "Internet not connected!", "error");
    }


    $scope.toggleAll = function (type) {

        if (type == 'email')
        {
            if ($rootScope.ChkBox.EmailTransferReceived == true)
            {
                // Set all Email FALSE
                $rootScope.ChkBox.EmailTransferReceived = false;
                $rootScope.ChkBox.EmailTransferSent = false;
            }
            else
            {
                // Set all Email TRUE
                $rootScope.ChkBox.EmailTransferReceived = true;
                $rootScope.ChkBox.EmailTransferSent = true;
            }
        }
        else
        {
            if ($rootScope.ChkBox.TransferReceived == true)
            {
                // Set all SMS FALSE
                $rootScope.ChkBox.TransferReceived = false;
            }
            else
            {
                // Set all SMS TRUE
                $rootScope.ChkBox.TransferReceived = true;
            }
        }

        $scope.SetNotificationFn();
    }
})
