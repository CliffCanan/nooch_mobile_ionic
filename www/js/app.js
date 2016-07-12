// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard)
        {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

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
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'SignupCtrl'
        })
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
        .state('app.dashboard', {
            url: '/dashboard',
            views: {
                'menuContent': {
                    templateUrl: 'templates/dashboard.html',
                    controller: 'DashboardCtrl'
                }
            }
        })
        .state('app.statistics', {
            url: '/statistics',
            views: {
                'menuContent': {
                    templateUrl: 'templates/statistics.html',
                    controller: 'StatisticsCtrl'
                }
            }
        })
        .state('app.history', {
            url: '/history',
            views: {
                'menuContent': {
                    templateUrl: 'templates/history.html',
                    controller: 'historyCtrl'
                }
            }
        })
        .state('app.setting', {
            url: '/settings',
            views: {
                'menuContent': {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('myProfile', {
            url: '/myProfile',
            templateUrl: 'templates/myProfile.html',
            controller: 'myProfileCtrl'
        })
        .state('socialSetting', {
            url: '/socialSetting',
            templateUrl: 'templates/socialSetting.html',
            controller: 'socialSettingCtrl'
        })
        .state('NotificationSetting', {
            url: '/NotificationSetting',
            templateUrl: 'templates/NotificationSetting.html',
            controller: 'notificationCtrl'
        })
        .state('securitySetting', {
            url: '/securitySetting',
            templateUrl: 'templates/securitySetting.html',
            controller: 'securitySettingCtrl'
        })

         .state('ResetPwd', {
             url: '/resetPwd',
             templateUrl: 'templates/resetPwd.html',
             controller: 'resetPwdCtrl'
                 
             })

        //Surya Testing Contact plugin
        .state('app.Accounts', {
            url: '/Accounts',
            views: {
                'menuContent': {
                    templateUrl: 'templates/Accounts.html',
                    controller: 'AccountCtrl'
                }
            }
        })
    //have to delete after testing 
    $urlRouterProvider.otherwise('app/dashboard');
});