angular.module('noochApp.TransferDetailsCtrl', ['noochApp.transferDetails-service', 'noochApp.services'])


       .controller('TransferDetailsCtrl', function ($scope, $stateParams, transferDetailsService, $ionicLoading, $localStorage) {
           $scope.$on("$ionicView.enter", function (event, data) {



               console.log('Transfer Details Controller');
               
               console.log('oibject -> ' + JSON.stringify($stateParams.myParam));
               $scope.transferDetail = $stateParams.myParam;
               $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
             

           })
           $scope.remindPayment = function (transactionId) {

               console.log("remoind payment" + transactionId);
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

                       transferDetailsService.RemindPayment(transactionId).success(function (data) {
                           if (data.Result.indexOf('successfully') > -1)
                           {
                               swal("Sent...", data.Result, "success");
                               $ionicLoading.hide();
                           }
                          
                       }).error(function (data) {
                           $ionicLoading.hide();
                       });
                   }
               });
           }

           $scope.cancelPayment = function (transactionId) {
               
               console.log("cancel payment" + transactionId);
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
                       transferDetailsService.CancelRequest(transactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Cancelled...", data.Result, "success");
                               $ionicLoading.hide();
                           }
                          
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }

           $scope.rejectPayment = function (transactionId) {

               console.log("cancel payment" + transactionId);
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
                       transferDetailsService.RejectPayment(transactionId).success(function (data) {
                           if (data.Result.indexOf('Successfully') > -1) {
                               swal("Rejected...", data.Result, "success");
                               $ionicLoading.hide();
                           }
                           $ionicLoading.hide();
                       }).error(function () { $ionicLoading.hide(); });
                   }
               });
           }

       })