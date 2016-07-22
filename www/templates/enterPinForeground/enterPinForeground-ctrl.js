angular.module('noochApp.enterPinForegroundCtrl', ['noochApp.enterPinForeground-service', 'noochApp.services'])

    .controller('enterPinForegroundCtrl', function ($scope, $state, ValidatePin, $ionicLoading,CommonServices) {

        $scope.Value = {
            Pin: ''
        };



        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');           
        });

        $scope.CheckPin = function () {
            console.log('Check Pin Function called');
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
             if (data.Result == 'Success')
             {
                 $state.go('app.home');
             }
             else if(data.Result == 'Invalid Pin')
             {
                 swal("Oops...", "Incorrect Pin !", "error");
             }
             else if(data.Message== 'An error has occurred.')
             {
                 swal("Oops...", "Something went wrong !", "error");
             }

         }).error(function (data) {
             console.log('eror' + data);
             $ionicLoading.hide();
         });            
            }).error(function (data) { });

            //}
            //else {
            //    swal("Oops...", "Internet not connected!", "error");
            //}
        };
    });
