angular.module('noochApp.StatisticsCtrl', ['noochApp.statistics-service', 'noochApp.services'])
/********************/
/***  STATISTICS  ***/
/********************/
.controller('StatisticsCtrl', function ($scope, statisticsService, $ionicLoading, $cordovaNetwork) {

    $scope.stats = {};

    $scope.export = {};

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Statistics Controller Loaded');

        $scope.GetMemberStatsFn();
    })

    $scope.slideOptions = {
        loop: false,
        effect: 'slide',
        speed: 500,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {

        $scope.activeIndex = data.slider.activeIndex;
        $scope.previousIndex = data.slider.previousIndex;

        //console.log(data.slider.activeIndex);

        if ($scope.activeIndex == 0)
        {
            $(".statsIconContainer button:not(.slide0)").removeClass("selected");
            $(".statsIconContainer .slide0").addClass("selected");
        }
        else if ($scope.activeIndex == 1)
        {
            $(".statsIconContainer button:not(.slide1)").removeClass("selected");
            $(".statsIconContainer .slide1").addClass("selected");
        }
        else if ($scope.activeIndex == 2)
        {
            $(".statsIconContainer button:not(.slide2)").removeClass("selected");
            $(".statsIconContainer .slide2").addClass("selected");
        }
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
        // note: the indexes are 0-based
    });


    $scope.GetMemberStatsFn = function () {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });


        statisticsService.GetMemberStatsGeneric('Largest_sent_transfer')
         .success(function (data) {
             $scope.stats.Largest_sent_transfer = data;
             console.log('Largest_sent_transfer');
             console.log($scope.stats.Largest_sent_transfer);
             $ionicLoading.hide();
         }).error(function (data) {
             console.log('eror' + data);
             $ionicLoading.hide();
         });


        statisticsService.GetMemberStatsGeneric('totelSent')
         .success(function (data) {
             $scope.stats.TotalSent = data;
             console.log('Totel Payment Sent');
             console.log($scope.stats.TotalSent);
             $ionicLoading.hide();
         }).error(function (data) {
             console.log('eror' + data);
             $ionicLoading.hide();
         });


        statisticsService.GetMemberStatsGeneric('Largest_received_transfer')
         .success(function (data) {
             $scope.stats.Largest_received_transfer = data;
             console.log('Largest_received_transfer');
             console.log($scope.stats.Largest_received_transfer);
             $ionicLoading.hide();
         }).error(function (data) {
             console.log('eror' + data);
             $ionicLoading.hide();
         });

        statisticsService.GetMemberStatsGeneric('Total_$_Received')
       .success(function (data) {
           $scope.stats.Total_$_Received = data;
           console.log('Total_$_Received');
           console.log($scope.stats.Total_$_Received);
           $ionicLoading.hide();
       }).error(function (data) {
           console.log('eror' + data);
           $ionicLoading.hide();
       });


        statisticsService.GetMemberStatsGeneric('Total_no_of_transfer_Received')
     .success(function (data) {
         $scope.stats.Total_no_of_transfer_Received = data;
         console.log('Total_no_of_transfer_Received');
         console.log($scope.stats.Total_no_of_transfer_Received);
         $ionicLoading.hide();
     }).error(function (data) {
         console.log('eror' + data);
         $ionicLoading.hide();
     });

        statisticsService.GetMemberStatsGeneric('Total_no_of_transfer_Sent')
        .success(function (data) {
            $scope.stats.Total_no_of_transfer_Sent = data;
            console.log('Total_no_of_transfer_Sent');
            console.log($scope.stats.Total_no_of_transfer_Sent);
            $ionicLoading.hide();
        }).error(function (data) {
            console.log('eror' + data);
            $ionicLoading.hide();
        });


        statisticsService.GetMemberStatsGeneric('Total_P2P_transfers')
      .success(function (data) {
          $scope.stats.Total_P2P_transfers = data;
          console.log('Total_P2P_transfers');
          console.log($scope.stats.Total_P2P_transfers);
          $ionicLoading.hide();
      }).error(function (data) {
          console.log('eror' + data);
          $ionicLoading.hide();
      });


        statisticsService.GetMemberStatsGeneric('Total_Friends_Invited')
      .success(function (data) {
          $scope.stats.Total_Friends_Invited = data;
          console.log('Total_Friends_Invited');
          console.log($scope.stats.Total_Friends_Invited);
          $ionicLoading.hide();
      }).error(function (data) {
          console.log('eror' + data);
          $ionicLoading.hide();
      });


        statisticsService.GetMemberStatsGeneric('Total_Friends_Joined')
     .success(function (data) {
         $scope.stats.Total_Friends_Joined = data;
         console.log('Total_Friends_Joined');
         console.log($scope.stats.Total_Friends_Joined);
         $ionicLoading.hide();
     }).error(function (data) {
         console.log('eror' + data);
         $ionicLoading.hide();
     });


        statisticsService.GetMemberStatsGeneric('Total_Posts_To_TW')
    .success(function (data) {
        $scope.stats.Total_Posts_To_TW = data;
        console.log('Total_Posts_To_TW');
        console.log($scope.stats.Total_Posts_To_TW);
        $ionicLoading.hide();
    }).error(function (data) {
        console.log('eror' + data);
        $ionicLoading.hide();
    });

        statisticsService.GetMemberStatsGeneric('Total_Posts_To_FB')
    .success(function (data) {
        $scope.stats.Total_Posts_To_FB = data;
        console.log('Total_Posts_To_FB');
        console.log($scope.stats.Total_Posts_To_FB);
        $ionicLoading.hide();
    }).error(function (data) {
        console.log('eror' + data);
        $ionicLoading.hide();
    });
        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }


    $scope.exportHistory = function () {
        console.log('exportHistoryFn touched ');
        // if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Getting account stats...'
        });

        statisticsService.sendTransactionInCSV()
        .success(function (data) {
            $ionicLoading.hide();

            $scope.export.IsSuccess = data;
            console.log('export.IsSuccess -> [' + $scope.export.IsSuccess.Result + ']');

            if ($scope.export.IsSuccess.Result == 1)
                swal("Export Successful", "Please check your email for a .CSV of your account transaction history.", "success");
            else
                swal("Error :-(", "Something went wrong! Please contact us to let us know.", "error");

            console.log($scope.export.IsSuccess.Result);

        }).error(function (data) {
            console.log('eror' + data);
            $ionicLoading.hide();
        });

        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}
    }

})
