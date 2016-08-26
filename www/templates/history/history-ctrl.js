angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

/*****************/
/***  HISTORY  ***/
/*****************/

    .controller('historyCtrl', function ($scope,$filter, historyService, $ionicLoading, $localStorage, $ionicListDelegate, transferDetailsService, $rootScope, $ionicContentBanner, $state, $ionicModal, CommonServices, ValidatePin) {
        $ionicModal.fromTemplateUrl('templates/history/modalPopUp.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };


        $scope.$on("$ionicView.enter", function (event, data) {
            var transDetails = {};
            $scope.SentC = true;
            $scope.ReceivedC = true;
            $scope.CancelledC = true;
            $scope.RejectedC = true;
            $scope.DisputedC = true;
            $scope.SentP = true;
            $scope.ReceivedP = true;
            $scope.DisputedP = true;
            
            $scope.transDetailsForPin = {};

            $rootScope.Location = {
                longi: '',
                lati: ''
            }

            console.log('History Page Loaded');

            //  if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading History...'
            });

            $scope.transactionList = '';
            $scope.completed = true;
            $scope.pending = false;
            $('#btnCompleted').addClass('active');
            $('#btnPending').removeClass('active');

            $scope.clickCompleted = function () {
                $scope.completed = true;
                $scope.pending = false;
            }

            $scope.clickPending = function () {
                $scope.pending = true;
                $scope.completed = false;
            }

            $scope.press = function (type) {
                console.log($scope.transactionList);
                var length = ($scope.transactionList.length);
                $scope.transactionList = [];
                for (var i = 0; i < length; i++) {
                    if (type == 'SentC')
                    {
                         
                        if ($scope.transactionList[i].TransactionStatus == 'Success' && $scope.transactionList[i].TransactionType == 'Transfer' && $scope.transactionList[i].MemberId == $scope.memberId)
                        $scope.transactionList[i]=($scope.transactionList[i]);
                    }



                }
                console.log($scope.transactionList);
                console.log($scope.transactionList.length);
            }


            $scope.$watch('search', function (val) {
                console.log($filter('filter')($scope.transactionList, val));

                $scope.transactionList = $filter('filter')($scope.transactionList, val);

                console.log($scope.transactionList);
            });

            historyService.getTransferList().success(function (data) {

                $scope.transactionList = data;
                //console.log('getTransferList result data----- >>>>>');
                //console.log($scope.transactionList);              
                for (var i = 0; i < $scope.transactionList.length; i++)
                {
                    $scope.transactionList[i].TransactionDate = new Date($scope.transactionList[i].TransactionDate);
                }

                $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;
                $ionicLoading.hide();
            }).error(function (data) {
                console.log('Get History Error: [' + data + ']');
                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });

            $scope.cancelPayment = function (trans) {

                console.log("Cancel Payment: [" + trans.TransactionId + ']');

                $ionicLoading.show({
                    template: 'Cancelling Request...'
                });

                transferDetailsService.CancelRequest(trans.TransactionId).success(function (data) {
                    if (data.Result.indexOf('Successfully') > -1)
                    {
                        swal({ title: "Request Cancelled", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                            $ionicLoading.hide();
                            location.reload();
                        });
                    }

                }).error(function (data) {
                    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                });
            }

            $scope.rejectPayment = function (trans) {

                console.log("Reject Payment Fired: [" + trans.TransactionId + ']');

                $ionicLoading.show({
                    template: 'Rejecting Request...'
                });

                transferDetailsService.RejectPayment(trans.TransactionId).success(function (data) {
                    $ionicLoading.hide();

                    if (data.Result.indexOf('Successfully') > -1)
                    {
                        swal({ title: "Request Rejected", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                            location.reload();
                        });
                    }
                }).error(function (data) {
                    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                });
            }

            $scope.remindPayment = function (trans) {

                $ionicLoading.show({
                    template: 'Sending Reminder...'
                });

                transferDetailsService.RemindPayment(trans.TransactionId).success(function (data) {
                    $ionicLoading.hide();

                    if (data.Result.indexOf('successfully') > -1)
                    {
                        swal({ title: "Sent", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                            location.reload();
                        });
                    }
                    else
                        swal("Error...", data.Result, "error");

                }).error(function (data) {
                    if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                        CommonServices.logOut();
                });
            }

            $scope.PayBack = function (trans) {
                console.log("Pay Back" + JSON.stringify(trans));
                $state.go('app.howMuch', { myParam: trans });
            }

            $scope.TransferMoney = function (trans) {
                transDetails = trans;
                transDetails.RecepientName = trans.Name;
                console.log("Transfer payment" + JSON.stringify(transDetails));

                CommonServices.savePinValidationScreenData({ myParam: transDetails, type: 'transfer', returnUrl: 'app.history', returnPage: 'History', comingFrom: 'Transfer' });

                $state.go('enterPin');
            }

      
            //}
            //else{
            //        swal("Oops...", "Internet not connected!", "error");
            //      }
        });

        $scope.$on('IsVerifiedPhoneFalse', function (event, args) {
            console.log('IsVerifiedPhoneFalse');
            $scope.contentBannerInstance();
        });

        $scope.contentBannerInstance = function () {
            $ionicContentBanner.show({
                text: ['Phone Number Not verified'],
                interval: '20',
                autoClose: '',
                type: 'error',
                transition: 'vertical'
            });
        }

        $scope.showMap = function (longi, lati) {
            // if ($cordovaNetwork.isOnline()) {
            if (longi == 0 && lati == 0)
            {
                console.log($rootScope.Location.longi);
                console.log($rootScope.Location.lati);
                swal("Oops...", "No Location found", "error");
            }
            else if (longi == '' && lati == '')
            {
                console.log($rootScope.Location.longi);
                console.log($rootScope.Location.lati);
                swal("Oops...", "No Location found", "error");
            }
            else
            {
                $ionicLoading.show({
                    template: 'Loading History...'
                });

                $state.go('app.map');
                console.log('from the function show map');

                console.log($rootScope.Location.longi);
                console.log($rootScope.Location.lati);
                $rootScope.Location.longi = longi;
                $rootScope.Location.lati = lati;
                //$rootScope.Location.longi = 31.3260;
                //$rootScope.Location.lati = 75.5762;

                //}
                //else{
                //        swal("Oops...", "Internet not connected!", "error");
                //      }
            }
        }
    });