// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('noochApp', ['ionic', 'noochApp.controllers', 'noochApp.LoginCtrl', 'noochApp.SignupCtrl', 'noochApp.historyCtrl',
    'noochApp.HomeCtrl', 'noochApp.resetPwdCtrl', 'noochApp.profileCtrl', 'noochApp.MenuCtrl', 'noochApp.howMuchCtrl', 'noochApp.notificationCtrl', 'noochApp.securitySettingCtrl',
    'noochApp.SelectRecipCtrl', 'noochApp.SettingCtrl', 'noochApp.socialSettingCtrl', 'noochApp.StatisticsCtrl', 'noochApp.TransferDetailsCtrl', 'noochApp.referAfriendCtrl', 'noochApp.testPageCtrl',
    'noochApp.enterPin', 'noochApp.services', 'ngCordova', 'ti-segmented-control'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard)
        {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar)
        {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {

    //$cordovaFacebookProvider.browserInit(198279616971457, "v2.0");

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup/signup.html',
            controller: 'SignupCtrl'
        })
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu/menu.html',
            controller: 'MenuCtrl'
        })
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.selectRecipient', {
            url: '/selectRecipient',
            views: {
                'menuContent': {
                    templateUrl: 'templates/selectRecipient/selectRecipient.html',
                    controller: 'SelectRecipCtrl'
                }
            }
        })
        .state('howMuch', {
            url: '/howMuch',
            templateUrl: 'templates/howMuch/howMuch.html',
            controller: 'howMuchCtrl'
        })
        .state('app.statistics', {
            url: '/statistics',
            views: {
                'menuContent': {
                    templateUrl: 'templates/statistics/statistics.html',
                    controller: 'StatisticsCtrl'
                }
            }
        })
        .state('app.history', {
            url: '/history',
            views: {
                'menuContent': {
                    templateUrl: 'templates/history/history.html',
                    controller: 'historyCtrl'
                }
            }
        })
        .state('app.setting', {
            url: '/settings',
            views: {
                'menuContent': {
                    templateUrl: 'templates/settings/settings.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile/profile.html',
            controller: 'profileCtrl'
        })
        .state('securitySetting', {
            url: '/securitySetting',
            templateUrl: 'templates/securitySetting/securitySetting.html',
            controller: 'securitySettingCtrl'
        })
        .state('socialSetting', {
            url: '/socialSetting',
            templateUrl: 'templates/socialSetting/socialSetting.html',
            controller: 'socialSettingCtrl'
        })
        .state('NotificationSetting', {
            url: '/NotificationSetting',
            templateUrl: 'templates/notificationSetting/NotificationSetting.html',
            controller: 'notificationCtrl'
        })
        .state('ResetPwd', {
            url: '/resetPwd',
            templateUrl: 'templates/resetPassword/resetPwd.html',
            controller: 'resetPwdCtrl'
        })
        .state('TransferDetails', {
            url: '/TransferDetails',
            templateUrl: 'templates/transferDetails/TransferDetails.html',
            controller: 'TransferDetailsCtrl'
        })
        .state('app.referAfriend', {
            url: '/referAfriend',
            views: {
                'menuContent': {
                    templateUrl: 'templates/referAfriend/referAfriend.html',
                    controller: 'referAfriendCtrl'
                }
            }
        })
        .state('enterPin', {
            url: '/enterPin',
            templateUrl: 'templates/enterPin/enterPin.html',
            controller: 'enterPinCtrl'
        })
        
        //Test Page
        .state('app.testPage', {
            url: '/testPage',
            views: {
                'menuContent': {
                    templateUrl: 'templates/testPage/testPage.html',
                    controller: 'testPageCtrl'
                }
            }
        })
    //test Page
    $urlRouterProvider.otherwise('app/home');
});