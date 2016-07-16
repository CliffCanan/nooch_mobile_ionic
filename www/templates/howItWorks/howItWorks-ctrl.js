angular.module('noochApp.howItWorksCtrl', ['noochApp.services'])


.controller('howItWorksCtrl', function ($scope, $state, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('How It Works Controller Loadad');
    })

    $scope.GoBack = function () {
        $ionicHistory.goBack();
    }

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
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
        // note: the indexes are 0-based
    });
})




