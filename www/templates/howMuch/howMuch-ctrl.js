angular.module('noochApp.howMuchCtrl', ['noochApp.howMuch-service', 'noochApp.services'])

.controller('howMuchCtrl', function ($scope, $state, $ionicPlatform, $ionicHistory, $stateParams, $ionicModal, howMuchService, $localStorage, $ionicPopup, CommonServices, ValidatePin, $ionicLoading) {

    $ionicModal.fromTemplateUrl('templates/enterPinForeground/enterPinForeground.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        
    });

    $scope.requestData = {
        "PinNumber": "",
        "MemberId": "",
        "SenderId": "",
        "Name": "",
        "Amount": "",
        "TransactionId": "",
        "TransactionDate": "",
        "DeviceId": "",
        "Latitude": "",
        "Longitude": "",
        "Altitude": "",
        "AddressLine1": "",
        "AddressLine2": "",
        "City": "",
        "State": "",
        "Country": "",
        "ZipCode": "",
        "Memo": "",
        "Status": "",
        "MoneySenderEmailId": "",
        "Picture": "",
        "isTesting": "",
        "isRentPayment": ""
    }

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('HowMuchCntrl Fired');
        console.log($stateParams);
        $scope.recipientDetail = $stateParams.myParam;
        $('#form').parsley();

        $(".amount-container input").focus();
    });

    $(".amount-container input").focusout(function () {
        if ($(".amount-container input").val().trim().length > 0)
        {
            if ($(this).parsley().validate() != true)
                $(this).focus();
            else
            {
                var enteredAmnt = $(".amount-container input").val().trim();
                if (enteredAmnt.indexOf(".") == -1)
                    $(".amount-container input").val(enteredAmnt + ".00");
                else if (enteredAmnt.indexOf(".") > enteredAmnt.length - 3)
                    $(".amount-container input").val(enteredAmnt + "0");
            }
        }
    });

    $scope.GoBack = function () {
        $state.go('app.selectRecipient');
    };

    $scope.submitRequest = function () {
        
        if ($('#howMuchForm').parsley().validate() == true)
        {
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="recipientDetail.pin">',
                title: 'Enter Pin',
                subTitle: 'Please enter Nooch Pin',
                scope: $scope,
                buttons: [
                  
                  {
                      text: '<b>Done</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          
                          if (!$scope.recipientDetail.pin) {
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                          } else {
                              console.log($scope);
                              return $scope.recipientDetail.pin;
                          }
                      }
                  }
                ]
            });

            myPopup.then(function (res) {
                CommonServices.GetEncryptedData(res).success(function (data) {
                    console.log(data.Status);

                    ValidatePin.ValidatePinNumberToEnterForEnterForeground(data.Status)
                   .success(function (data) {
                       // $scope.Data = data;
                       console.log($scope.data);

                       $ionicLoading.hide();
                       if (data.Result == 'Success') {
                           console.log($scope.recipientDetail.Amount);
                           $scope.requestData.MemberId = $localStorage.GLOBAL_VARIABLES.MemberId;
                           $scope.requestData.Amount = $scope.recipientDetail.Amount;
                           $scope.requestData.SenderId = $scope.recipientDetail.MemberId;
                           $scope.requestData.Name = $scope.recipientDetail.FirstName + ' ' + $scope.recipientDetail.LastName;
                           $scope.requestData.Memo = $scope.recipientDetail.Memo;
                           howMuchService.RequestMoney($scope.requestData).success(function (data) {

                               if (data.Result.indexOf('successfully') > -1) {
                                   swal("Success...", data.Result, "success");
                               }
                               else {
                                   swal("Error...", data.Result, "error");
                               }
                           }).error();
                       }
                       else if (data.Result == 'Invalid Pin') {
                           swal("Oops...", "Incorrect Pin !", "error");
                       }
                       else if (data.Message == 'An error has occurred.') {
                           swal("Oops...", "Something went wrong !", "error");
                       }

                   }).error(function (data) {
                       console.log('eror' + data);
                       $ionicLoading.hide();
                   });
                }).error(function (data) { });
            });
          
           // $state.go('enterPin');
        }
    };
 
   

    $scope.addImage = function () {
        $ionicPlatform.ready(function () {
            window.imagePicker.getPictures(function (results) {
                for (var i = 0; i < results.length; i++)
                {
                    console.log('Image URI: ' + results[i]);
                }
            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: 1,
                width: 800
            }
            );
        });
    };
})
