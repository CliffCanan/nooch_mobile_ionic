angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

    .controller('historyCtrl', function ($scope, $filter, historyService, $cordovaGoogleAnalytics, $ionicPlatform, $ionicLoading, $localStorage,
                                         $ionicListDelegate, $rootScope, $ionicContentBanner, $state, $ionicHistory, $ionicActionSheet,
                                         transferDetailsService, CommonServices, ValidatePin) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('History Page Loaded');

            console.log();

           

            $scope.historyListHeight = { 'height': $rootScope.screenHeight - 155 + 'px' }
            $scope.firstTimeDivHeight = { 'min-height': $rootScope.screenHeight - 151 + 'px' }
            $scope.transDetailsForPin = {};
            var transDetails = {};
            console.log($scope.transactionList);

            if (typeof $scope.transactionList == 'undefined')
            {
                $scope.isFinishedLoading = false;
                $scope.transactionList = [];
                $scope.completed = true;
                $scope.pending = false;
                $('#btnCompleted').addClass('active');
                $('#btnPending').removeClass('active');

                $scope.getTransactions();
            }

            $rootScope.Location = {
                longi: '',
                lati: ''
            }

            $ionicPlatform.ready(function () {
                if (typeof analytics !== 'undefined') analytics.trackView("History Screen");
            })
        });


        $scope.getTransactions = function () {
            $ionicLoading.show({
                template: 'Loading Payment History...'
            });
            historyService.getTransferList('')
				.success(function (data) {
				    $scope.isFinishedLoading = true;

				    $scope.transactionList = data;
				    $scope.filterFlag = data;
				    // console.log('GetTransferList Result Data >>>>>');
				    // console.log($scope.transactionList);

				    for (var i = 0; i < $scope.transactionList.length; i++)
				    {
				        $scope.transactionList[i].TransactionDate = new Date($scope.transactionList[i].TransactionDate);
				    }
				    $scope.transList = $scope.transactionList;
				    $scope.memberId = $localStorage.GLOBAL_VARIABLES.MemberId;

				    $ionicLoading.hide();
				})
				.error(function (error) {
				    $scope.isFinishedLoading = true;
				    console.log('History Cntrl -> GetTransferList Error: [' + JSON.stringify(error) + ']');

				    $ionicLoading.hide();

				    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				        CommonServices.logOut();
				});
        }


        $scope.cancelPayment = function (trans) {

            console.log("Cancel Payment: [" + trans.TransactionId + ']');
            console.log(trans);

            var bodyText = "Are you sure you want to cancel this request";
            // CC (9/15/16): still need to add a check to see if we have the recipient's name (i.e. a request to an existing user
            // or not).  If yes, then add the name to the end of bodyText...
            // if (IS TO EXISTING USER)
            // bodyText += " " + EXISTING USER'S FULL NAME;
            // else
            bodyText += "?";

            swal({
                title: "Cancelled Request?",
                text: bodyText,
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Yes",
                showCancelButton: true,
            }, function (isConfirm) {
                if (isConfirm)
                {
                    $ionicLoading.show({
                        template: 'Cancelling Request...'
                    });

                    if (trans.MemberId == trans.RecepientId)
                    {
                        transferDetailsService.CancelMoneyRequestForNonNoochUser(trans.TransactionId)
                            .success(function (data) {
                                if (data.Result.indexOf('Successfully') > -1)
                                {
                                    swal({ title: "Request Cancelled", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                                        $ionicLoading.hide();
                                        $state.reload();
                                    });
                                }
                            })
                            .error(function (data) {
                                $ionicLoading.hide();
                                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                    CommonServices.logOut();
                            });
                    }
                    else
                    {
                        transferDetailsService.CancelMoneyRequestForExistingNoochUser(trans.TransactionId)
                            .success(function (data) {
                                if (data.Result.indexOf('Successfully') > -1)
                                {
                                    swal({ title: "Request Cancelled", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                                        $ionicLoading.hide();
                                        $state.reload();
                                    });
                                }
                            })
                            .error(function (data) {
                                $ionicLoading.hide();
                                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                                    CommonServices.logOut();
                            });
                    }
                }
            });
        }


        $scope.rejectPayment = function (trans) {

            console.log("Reject Payment Fired: [" + trans.TransactionId + ']');

            //$ionicLoading.show({
            //    template: 'Rejecting Request...'
            //});

            swal({
                title: "Reject Payment",
                text: "Are you sure you want to Reject this Payment ?",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Yes",
                showCancelButton: true,
            }, function (isConfirm) {
                if (isConfirm)
                {
                    transferDetailsService.RejectPayment(trans.TransactionId)
                        .success(function (data) {
                            $ionicLoading.hide();

                            if (data.Result.indexOf('Successfully') > -1)
                                swal({
                                    title: "Request Rejected",
                                    text: data.Result,
                                    type: "success",
                                    confirmButtonColor: "#3fabe1"
                                }, function () {
                                    $state.reload();
                                });
                        })
                        .error(function (error) {
                            $ionicLoading.hide();
                            if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                                CommonServices.logOut();
                        });
                }
            })
        }


        $scope.remindPayment = function (trans) {

            swal({
                title: "Send Reminder",
                text: "Do you want to send a reminder about this request?",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Yes",
                showCancelButton: true,
            }, function (isConfirm) {
                if (isConfirm)
                {
                    $ionicLoading.show({
                        template: 'Sending Reminder...'
                    });

                    transferDetailsService.RemindPayment(trans.TransactionId)
		                .success(function (data) {
		                    console.log(data);
		                    $ionicLoading.hide();

		                    if (data.Result.indexOf('successfully') > -1)
		                        swal({
		                            title: "Reminder Sent Successfully",
		                            text: null,
		                            type: "success",
		                            confirmButtonColor: "#3fabe1"
		                        });
		                    else
		                        swal("Error", data.Result, "error");
		                })
		                .error(function (error) {
		                    $ionicLoading.hide();
		                    if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
		                        CommonServices.logOut();
		                });
                }
            });
        }


        $scope.PayBack = function (trans) {

            console.log("Pay Back Result: [" + JSON.stringify(trans) + ']');
            $state.go('app.howMuch', { myParam: trans });
        }


        $scope.TransferMoney = function (trans) {

            swal({
                title: "Pay Request?",
                text: "Are you sure you want to pay for this request ?",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Yes",
                showCancelButton: true,
            }, function (isConfirm) {
                if (isConfirm)
                {

                    transDetails = trans;
                    transDetails.RecepientName = trans.Name;
                    console.log("Transfer Money Result: [" + JSON.stringify(transDetails) + ']');

                    CommonServices.savePinValidationScreenData({ transObj: transDetails, type: 'transfer', returnUrl: 'app.history', returnPage: 'History', comingFrom: 'Transfer' });

                    $state.go('enterPin');
                }
            });
        }


        $scope.showMap = function (longi, lati) {
            // if ($cordovaNetwork.isOnline()) {
            //console.log($rootScope.Location.longi);
            //console.log($rootScope.Location.lati);

            if (longi == 0 || lati == 0 || longi == '' || lati == '')
            {
                $ionicContentBanner.show({
                    text: ['No Location Found'],
                    autoClose: '3000',
                    type: 'error',
                    transition: 'vertical'
                });
            }
            else
            {
                $ionicLoading.show({
                    template: 'Loading Payment Location...'
                });              

                $rootScope.Location.longi = longi;
                $rootScope.Location.lati = lati;
                $state.go('app.map');
                $ionicLoading.hide();
            }
            //}
            //else
            //  swal("Error", "Internet not connected!", "error");
        }


        $scope.toggleView = function (view) {
            $ionicHistory.clearCache().then(function () {

                if (view == 'completed')
                {
                    $scope.transactionList = [];
                    $scope.transactionList = $scope.transList;
                    $scope.completed = true;
                    $scope.pending = false;
                }
                else
                {
                    $scope.transactionList = [];
                    $scope.transactionList = $scope.transList;
                    $scope.pending = true;
                    $scope.completed = false;
                }
            });
        }


        $scope.openFilterChoices = function () {
            $('#btnCompleted').attr('disabled', true);
            $('#btnPending').attr('disabled', true);

            var title = $scope.completed == true ? "Filter Options (Completed Payments)" : "Filter Options (Pending Payments)";
            var buttons = [];
            if ($scope.completed == true)
            {
                buttons = [
                    { text: 'Sent' },
                    { text: 'Received' },
                    { text: 'Cancelled' },
                    { text: 'Rejected' },
                    { text: 'Disputed' }
                ]
            }
            else
            {
                buttons = [
                    { text: 'Sent' },
                    { text: 'Received' },
                    { text: 'Disputed' },
                ]
            }

            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: title,
                cancelText: 'Cancel',
                cancel: function () {
                    $('#btnCompleted').attr('disabled', false);
                    $('#btnPending').attr('disabled', false);
                },
                buttonClicked: function (index) {
                    if (index == 0)
                    {
                        if ($scope.completed == true)
                            $scope.setFilter('SentC');
                        else
                            $scope.setFilter('SentP');
                    }
                    else if (index == 1)
                    {
                        if ($scope.completed == true)
                            $scope.setFilter('ReceivedC');
                        else
                            $scope.setFilter('ReceivedP');
                    }
                    else if (index == 2)
                    {
                        if ($scope.completed == true)
                            $scope.setFilter('Cancelled');
                        else
                            $scope.setFilter('SentP');
                    }
                    else if (index == 3)
                    {
                        if ($scope.completed == true)
                            $scope.setFilter('Rejected');
                    }
                    else if (index == 4)
                    {
                        if ($scope.completed == true)
                            $scope.setFilter('DisputedC');
                    }

                    return true;
                }
            });
        };


        $scope.setFilter = function (type) {

            var filteredList = [];

            $scope.transactionList = $scope.transList;

            console.log($scope.transactionList);

            var length = ($scope.transactionList.length);

            for (var i = 0; i < length; i++)
            {
                if (type == 'SentC')
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Success' &&
                         $scope.transactionList[i].MemberId == $scope.memberId &&
                        ($scope.transactionList[i].TransactionType == 'Transfer' || $scope.transactionList[i].TransactionType == 'Request'))
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'ReceivedC')
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Success' &&
                         $scope.transactionList[i].MemberId != $scope.memberId &&
                        ($scope.transactionList[i].TransactionType == 'Transfer' || $scope.transactionList[i].TransactionType == 'Request'))
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'Cancelled')
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Cancelled')
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'Rejected')
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Rejected')
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'DisputedC')
                {
                    if ($scope.transactionList[i].TransactionType == 'Disputed' && $scope.transactionList[i].DisputeStatus == 'Resolved')
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'SentP')
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Pending' &&
                         $scope.transactionList[i].MemberId == $scope.memberId &&
                        ($scope.transactionList[i].TransactionType == 'Invite' || $scope.transactionList[i].TransactionType == 'Request'))
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'ReceivedP') // can't receive a Pending 'Transfer' - therefore this can only be requests
                {
                    if ($scope.transactionList[i].TransactionStatus == 'Pending' &&
                       $scope.transactionList[i].MemberId != $scope.memberId &&
                       $scope.transactionList[i].TransactionType == 'Request')
                        filteredList.push($scope.transactionList[i]);
                }
                else if (type == 'DisputedP')
                {
                    if ($scope.transactionList[i].TransactionType == 'Disputed' &&
                        $scope.transactionList[i].DisputeStatus == 'Under Review')
                        filteredList.push($scope.transactionList[i]);
                }
            }
            console.log(filteredList);

            $scope.transactionList = filteredList;
            $('#btnCompleted').attr('disabled', false);
            $('#btnPending').attr('disabled', false);
        }


        $scope.$watch('search', function (val) {
            //console.log("SEARCH FIRED");
            //console.log($filter('filter')($scope.transactionList, val));

            $scope.transactionList = $filter('filter')($scope.transactionList, val);

            ///console.log($scope.transactionList);

            if ($('#searchBar').val().length == 0)
                $scope.transactionList = $scope.transList;
        });

    });