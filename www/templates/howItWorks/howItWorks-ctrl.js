angular.module('noochApp.howItWorksCtrl', ['noochApp.services'])


.controller('howItWorksCtrl', function ($scope, $state, $ionicHistory, $cordovaGoogleAnalytics, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('How It Works Controller Loadad');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== undefined) analytics.trackView("howItWorksCtrl");
        })
    })

    $scope.slideOptions = {
        loop: false,
        effect: 'slide',
        speed: 550,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
        //$scope.activeIndex = data.slider.activeIndex;
        //$scope.previousIndex = data.slider.previousIndex;

        var slideToAddAnimation = data.slider.activeIndex + 1;
        $("#slide" + slideToAddAnimation + " .slideImage").addClass("bounceIn");
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
        if (data.slider.activeIndex == 4)
            $("#tourDoneBtn").css("opacity", "1").addClass("slideInDown");
    });

    $scope.endTour = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('app.home');
    }
})
