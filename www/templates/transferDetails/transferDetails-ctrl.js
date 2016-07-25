angular.module('noochApp.TransferDetailsCtrl', ['noochApp.transferDetails-service', 'noochApp.services'])


       .controller('TransferDetailsCtrl', function ($scope, $stateParams, transferDetailsService, $ionicLoading, $localStorage, $state) {
           $scope.transferDetail = {};
           $scope.$on("$ionicView.enter", function (event, data) {



               console.log('Transfer Details Controller');
               
               console.log('oibject -> ' + JSON.stringify($stateParams.myParam));
               $scope.transferDetail = $stateParams.myParam;
               $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
             

           })
           $scope.remindPayment = function () {

             
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Send Reminder for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Send",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Sending Reminder ...'
                       });

                       transferDetailsService.RemindPayment($scope.transferDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('successfully') > -1) {
                               swal("Sent...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                           else {
                               swal("Error...", data.Result, "error");
                               $ionicLoading.hide();
                           }
                          
                       }).error(function (data) {
                           $ionicLoading.hide();
                       });
                   }
               });
           }

           $scope.cancelPayment = function () {
               
               console.log("cancel payment" + $scope.transferDetail.TransactionId);
               swal({
                   title: "Are you sure?",
                   text: "Do you want to cancel this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Cancel",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Cancelling Payment ...'
                       });
                       transferDetailsService.CancelRequest($scope.transferDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Cancelled...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                          
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }

           $scope.rejectPayment = function () {

               console.log("cancel payment" + $scope.transferDetail.TransactionId);
               swal({
                   title: "Are you sure?",
                   text: "Do you want to reject this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Reject",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Rejecting Payment ...'
                       });
                       transferDetailsService.RejectPayment($scope.transferDetail.TransactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Rejected...", data.Result, "success");
                               $ionicLoading.hide();
                               $state.go('app.history');
                           }
                           $ionicLoading.hide();
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }

           $scope.TransferMoney = function () {
              
               console.log("Transfer payment" + JSON.stringify( $scope.transferDetail.TransactionId));
               swal({
                   title: "Are you sure?",
                   text: "Do you want to Pay for this transaction?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes - Pay",
               }, function (isConfirm) {
                   if (isConfirm) {
                       $ionicLoading.show({
                           template: 'Paying Payment ...'
                       });
                       if ($scope.transferDetail.MemberId != $scope.transferDetail.RecepientId) {
                           transferDetailsService.TransferMoney($scope.transferDetail).success(function (data) {
                               if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                   swal("Payed...", data.Result, "success");
                                   $ionicLoading.hide();
                               }
                               else {
                                   swal("Error...", data.Result, "error");
                                   $ionicLoading.hide();
                               }
                               $ionicLoading.hide();
                           }).error(function () { $ionicLoading.hide(); });
                       }
                       else if ($scope.transferDetail.MemberId == $scope.transferDetail.RecepientId && $scope.transferDetail.InvitationSentTo.length > 0) {
                           transferDetailsService.TransferMoney($scope.transferDetail).success(function (data) {
                               if (data.Result && data.Result.indexOf('Successfully') > -1) {
                                   swal("Payed...", data.Result, "success");
                                   $ionicLoading.hide();
                               }
                               else {
                                   swal("Error...", data.Result, "error");
                                   $ionicLoading.hide();
                               }
                               $ionicLoading.hide();
                           }).error(function () { $ionicLoading.hide(); });
                       }
                       else if ($scope.transferDetail.MemberId == $scope.transferDetail.RecepientId && $scope.transferDetail.PhoneNumberInvited.length > 0) { }
                       }
               });
           }

       })