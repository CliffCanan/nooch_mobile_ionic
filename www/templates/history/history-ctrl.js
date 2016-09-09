angular.module('noochApp.historyCtrl', ['noochApp.history-service', 'noochApp.services'])

    .controller('historyCtrl', function ($scope, $filter, historyService, $ionicLoading, $localStorage, $ionicListDelegate,
                transferDetailsService, $rootScope, $ionicContentBanner, $state, CommonServices, ValidatePin, $ionicHistory, $ionicActionSheet) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('History Page Loaded');
			$scope.isFinishedLoading = false;

            $ionicLoading.show({
                template: 'Loading Payment History...'
            });

            var transDetails = {};

            $scope.transDetailsForPin = {};

            $rootScope.Location = {
                longi: '',
                lati: ''
            }

            //  if ($cordovaNetwork.isOnline()) {

            $scope.transactionList = [];
            $scope.completed = true;
            $scope.pending = false;
            $('#btnCompleted').addClass('active');
            $('#btnPending').removeClass('active');


            historyService.getTransferList()
				.success(function (data) {
					$scope.isFinishedLoading = true;

	                $scope.transactionList = data;
	                console.log('GetTransferList Result Data >>>>>');
	                console.log($scope.transactionList);

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
            //}
            //else
            //  swal("Oops...", "Internet not connected!", "error");
        });

        $scope.cancelPayment = function (trans) {

            console.log("Cancel Payment: [" + trans.TransactionId + ']');

            $ionicLoading.show({
                template: 'Cancelling Request...'
            });

            transferDetailsService.CancelRequest(trans.TransactionId).success(function (data) {
                if (data.Result.indexOf('Successfully') > -1)
                    swal({
                        title: "Request Cancelled",
                        text: data.Result,
                        type: "success",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Ok!"
                    }, function () {
                        $ionicLoading.hide();
                        location.reload();
                    });
            })
			.error(function (error) {
                $ionicLoading.hide();
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
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
                    swal({
                        title: "Request Rejected",
                        text: data.Result,
                        type: "success",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Ok!"
                    }, function () {
                        location.reload();
                    });
            })
			.error(function (error) {
                $ionicLoading.hide();
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
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
                    swal({ title: "Sent", text: data.Result, type: "success", confirmButtonColor: "#DD6B55", confirmButtonText: "Ok!" }, function () {
                        location.reload();
                    });
                else
                    swal("Error", data.Result, "error");

            }).error(function (error) {
                $ionicLoading.hide();
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
        }

        $scope.PayBack = function (trans) {
            console.log("Pay Back Result: [" + JSON.stringify(trans) + ']');
            $state.go('app.howMuch', { myParam: trans });
        }

        $scope.TransferMoney = function (trans) {
            transDetails = trans;
            transDetails.RecepientName = trans.Name;
            console.log("Transfer Money Result: [" + JSON.stringify(transDetails) + ']');

            CommonServices.savePinValidationScreenData({ myParam: transDetails, type: 'transfer', returnUrl: 'app.history', returnPage: 'History', comingFrom: 'Transfer' });

            $state.go('enterPin');
        }


        $scope.showMap = function (longi, lati) {
            // if ($cordovaNetwork.isOnline()) {
            if (longi == 0 || lati == 0 || longi == '' || lati == '')
            {
                console.log($rootScope.Location.longi);
                console.log($rootScope.Location.lati);
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

                $state.go('app.map');
                console.log('from the function show map');

                console.log($rootScope.Location.longi);
                console.log($rootScope.Location.lati);
                $rootScope.Location.longi = longi;
                $rootScope.Location.lati = lati;
            }
            //}
            //else
            //  swal("Oops...", "Internet not connected!", "error");
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
                console.log("ToggleView Fired - [" + view + "]");
                //console.log($scope.transactionList);
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
			console.log("SEARCH FIRED");
            console.log($filter('filter')($scope.transactionList, val));

            $scope.transactionList = $filter('filter')($scope.transactionList, val);

            console.log($scope.transactionList);

            if ($('#searchBar').val().length == 0)
                $scope.transactionList = $scope.transList;
        });


        $scope.historyListHeight = { 'max-height': $rootScope.screenHeight - 150 + 'px' }


        $scope.firstTimeDivHeight = { 'min-height': $rootScope.screenHeight - 151 + 'px' }

        //console.log($scope.historyListHeight);
        //console.log($scope.firstTimeDivHeight);
    });