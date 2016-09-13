angular.module('noochApp.enterPinForegroundCtrl', ['noochApp.enterPinForeground-service', 'noochApp.services'])

    .controller('enterPinForegroundCtrl', function ($scope, $state, ValidatePin, $ionicLoading, CommonServices, $cordovaGoogleAnalytics, $ionicPlatform) {

        $scope.Value = {
            Pin: ''
        };

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');

            $ionicPlatform.ready(function () {
                if (typeof analytics !== undefined) analytics.trackView("enterPinForeground Controller");
            })
        });                        
        
        $scope.CheckPin = function () {
            console.log('Check Pin Function called');
            if ($('#frmPinForeground').parsley().validate() == true) {
                console.log($scope.Value.Pin);

                //if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show({
                    template: 'Loading ...'
                });

                CommonServices.GetEncryptedData($scope.Value.Pin).success(function (data) {
                    console.log(data.Status);

                    ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
                   .success(function (data) {
                       // $scope.Data = data;
                       console.log($scope.data);

                       $ionicLoading.hide();
                       if (data.Result == 'Success') {
                           $state.go('app.home');
                       }
                       else if (data.Result == 'Invalid Pin') {
                           swal("Oops...", "Incorrect Pin !", "error");
                       }
                       else if (data.Message == 'An error has occurred.') {
                           swal("Oops...", "Something went wrong !", "error");
                       }

                   }).error(function (data) {
                       console.log('eror' + data);
                     //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();  
                   });
                }).error(function (data) {
                  //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();  
                });

                //}
                //else {
                //    swal("Oops...", "Internet not connected!", "error");
                //}
            }
        };
    });
