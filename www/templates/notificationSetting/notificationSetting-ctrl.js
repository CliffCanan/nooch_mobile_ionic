angular.module('noochApp.notificationSettingCtrl', ['noochApp.services', 'noochApp.notificationSetting-service'])

.controller('notificationSettingCtrl', function ($scope, $rootScope, $ionicLoading, $state, CommonServices, notificationServices, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log("CHECKPOINT NOTIF 11");
        if ($rootScope.ChkBox == null)
        {
            console.log("CHECKPOINT NOTIF 22");
            $rootScope.ChkBox = {
                EmailTransferReceived: '',
                EmailTransferSent: '',
                TransferReceived: '',
            };
        }

        $scope.GetNotificationFn();

        $ionicPlatform.ready(function () {
            if (typeof analytics !== undefined) analytics.trackView("notificationSetting Controller");
            $scope.initEvent = function () {
                if (typeof analytics !== undefined) { analytics.trackEvent("Category", "Action", "Label", 25); }
            }
            analytics.startTrackerWithId('UA-36976317-2')
            analytics.trackView('notificationSetting Screen')
            //analytics.trackEvent('Category', 'Action', 'Label', Value)
            //analytics.setUserId('my-user-id')
            analytics.debugMode()

            //console.log($cordovaGoogleAnalytics);
            //$cordovaGoogleAnalytics.debugMode();
            //$cordovaGoogleAnalytics.startTrackerWithId('UA-36976317-2');
            //$cordovaGoogleAnalytics.setUserId('UA-36976317-2');
            //$cordovaGoogleAnalytics.trackView('Home Screen');
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
            })
            .error(function (data) {
                console.log('MemberEmailNotificationSettings Error: [' + JSON.stringify(data) + ']');
                $ionicLoading.hide();
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        //  }
        //else
        //    swal("Oops...", "Internet not connected!", "error");
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
