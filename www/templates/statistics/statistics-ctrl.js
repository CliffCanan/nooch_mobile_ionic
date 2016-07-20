angular.module('noochApp.StatisticsCtrl', ['noochApp.statistics-service', 'noochApp.services'])
/********************/
/***  STATISTICS  ***/
/********************/
.controller('StatisticsCtrl', function ($scope, statisticsService) {
    $scope.stats = {
        TotalCompletedPayments: '',
        PaymentSent: '',
        TotalSent: '',
        PaymentReceived: '',
        TotalRecevied: '',
        LargestTransferSent: '',
        largestTransferReceived: ''
         
    };

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('Statistics Controller Loaded');
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
        console.log('Slide change is beginning');
        $scope.activeIndex = data.slider.activeIndex;
        $scope.previousIndex = data.slider.previousIndex;

        console.log(data.slider.activeIndex);

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

    statisticsService.getTransferStats();
})
