// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('noochApp', ['ionic', 'ionic.service.core', 'noochApp.controllers', 'noochApp.LoginCtrl', 'noochApp.SignupCtrl', 'noochApp.historyCtrl',
  'noochApp.HomeCtrl', 'noochApp.resetPwdCtrl', 'noochApp.profileCtrl', 'noochApp.MenuCtrl', 'noochApp.howMuchCtrl', 'noochApp.notificationCtrl',
  'noochApp.securitySettingCtrl', 'noochApp.SelectRecipCtrl', 'noochApp.SettingCtrl', 'noochApp.socialSettingCtrl', 'noochApp.StatisticsCtrl',
  'noochApp.TransferDetailsCtrl', 'noochApp.referAfriendCtrl', 'noochApp.testPageCtrl', 'noochApp.enterPin', 'noochApp.createPin', 'noochApp.services',
  'noochApp.addPicture', 'noochApp.howItWorksCtrl', 'noochApp.limitsAndFeesCtrl', 'noochApp.enterPinForegroundCtrl', 'ngCordova', 'ti-segmented-control', 'ngStorage'])

  .run(function ($ionicPlatform, $localStorage, $cordovaDevice, CommonHelper, $cordovaPushV5, $cordovaNetwork, $state,$rootScope,$cordovaGeolocation) {
    $ionicPlatform.ready(function () {




      // this functino will gets fired when app comes to foreground
      document.addEventListener("resume", function () {

        console.log('came in resume state');
        if ($localStorage.GLOBAL_VARIABLES.EnterPinImmediately == true) {
          $state.go('enterPin');
        }

      }, false);
      // this function gets fired when app goes to background
      document.addEventListener("pause", function () {
        console.log('came in pause state');
      }, false);

      if (!$localStorage.GLOBAL_VARIABLES) {
        $localStorage.GLOBAL_VARIABLES = {
          IsDemoDone: false, // for displaying tutorial screens to user - if any
          IsRemeberMeEnabled: false, // for remembering user

          IsUserLocationSharedWithNooch: false, // to keep track of location sharing
          UserCurrentLatitude: '',  // user current lat if shared location
          UserCurrentLongi: '',  // user current lon if shared location0

          MemberId: '', // MemberId of user -- logged in user
          UserName: '',

          AccessToken: '',

          IsNotificationPermissionGiven: false,// will store here about push notification permission from user
          DeviceId: '',// this would be unique device id,
          DeviceToken: '', // or notification token.. will be used for sending push notifications from server
          DeviceOS: '',// to save current device operating system info... iOS or Android

          IsNetworkAvailable: false,
          EnterPinImmediately: true // to check if pin is required while coming back to foreground or app launch


        };
      }
      if (window.cordova) {

        // getting device info..will be used for dealing with notifications

        var device = $cordovaDevice.getDevice();

        $localStorage.GLOBAL_VARIABLES.DeviceOS = device.platform;
        $localStorage.GLOBAL_VARIABLES.DeviceId = device.uuid;


        // setting push notification related stuff
        var optionsForNotificationSetup = {
          android: {
            senderID: "104707683579"
          },
          ios: {
            alert: "true",
            badge: "true",
            sound: "true"
          },
          windows: {}
        };


        // initialize
        $cordovaPushV5.initialize(optionsForNotificationSetup).then(function () {
          // start listening for new notifications
          $cordovaPushV5.onNotification();
          // start listening for errors
          $cordovaPushV5.onError();

          // register to get registrationId
          $cordovaPushV5.register().then(function (data) {
            // `data.registrationId` save it somewhere;
            $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven = true;
            $localStorage.GLOBAL_VARIABLES.DeviceToken = data.registrationId;


          })
        });


        // triggered every time notification received
        $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
          // data.message,
          // data.title,
          // data.count,
          // data.sound,
          // data.image,
          // data.additionalData

          console.log('reveived some notification, notification data -> ' + JSON.stringify(data));
        });

        // triggered every time error occurs
        $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
          // e.message
          console.log('reveived some notification error, notification error -> ' + e.message);
          $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven = false;
        });


        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            var lat = position.coords.latitude
            var long = position.coords.longitude

            console.log('lat in success -> ' + lat);
            console.log('long in success -> ' + long);

            $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = true;

          }, function (err) {
            // error
            console.log('error ' + JSON.stringify(err));

            $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;


          });


        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline == true) {
          $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = true;
        }

        var isOffline = $cordovaNetwork.isOffline();
        if (isOffline == true) {
          $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = false;
        }

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          var onlineState = networkState;
          console.log('came in online state change' + JSON.stringify(networkState));
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          var offlineState = networkState;
          console.log('came in offline state change' + JSON.stringify(networkState));
        })

      }
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
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
      //.state('TransferDetails', {
      //  url: '/TransferDetails',
      //  templateUrl: 'templates/transferDetails/TransferDetails.html',
      //  controller: 'TransferDetailsCtrl'
      //})
      .state('app.TransferDetails', {
        url: '/history/TransferDetails',
        params: {myParam: null},
        views: {
          'menuContent': {
            templateUrl: 'templates/transferDetails/TransferDetails.html',
            controller: 'TransferDetailsCtrl'
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
      .state('app.howItWorks', {
        url: '/howItWorks',
        views: {
          'menuContent': {
            templateUrl: 'templates/howItWorks/howItWorks.html',
            controller: 'howItWorksCtrl'
          }
        }
      })
      .state('app.limitsAndFees', {
        url: '/limitsAndFees',
        views: {
          'menuContent': {
            templateUrl: 'templates/limitsAndFees/limitsAndFees.html',
            controller: 'limitsAndFeesCtrl'
          }
        }
      })
      //.state('profile', {
      //    url: '/profile',
      //    templateUrl: 'templates/profile/profile.html',
      //    controller: 'profileCtrl'
      //})
      //.state('securitySetting', {
      //    url: '/securitySetting',
      //    templateUrl: 'templates/securitySetting/securitySetting.html',
      //    controller: 'securitySettingCtrl'
      //})
      .state('app.profile', {
        url: '/settings/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile/profile.html',
            controller: 'profileCtrl'
          }
        }
      })
      .state('app.securitySetting', {
        url: '/settings/securitySetting',
        views: {
          'menuContent': {
            templateUrl: 'templates/securitySetting/securitySetting.html',
            controller: 'securitySettingCtrl'
          }
        }
      })
      .state('app.socialSetting', {
        url: '/settings/socialSetting',
        views: {
          'menuContent': {
            templateUrl: 'templates/socialSetting/socialSetting.html',
            controller: 'socialSettingCtrl'
          }
        }
      })
      .state('app.NotificationSetting', {
        url: '/settings/NotificationSetting',
        views: {
          'menuContent': {
            templateUrl: 'templates/notificationSetting/NotificationSetting.html',
            controller: 'notificationCtrl'
          }
        }
      })
      .state('app.ResetPwd', {
        url: '/settings/securitySetting/ResetPwd',
        views: {
          'menuContent': {
            templateUrl: 'templates/resetPassword/resetPwd.html',
            controller: 'resetPwdCtrl'
          }
        }
      })
      .state('app.ResetPin', {
        url: '/settings/securitySetting/ResetPin',
        views: {
          'menuContent': {
            templateUrl: 'templates/resetPassword/resetPin.html',
            controller: 'resetPwdCtrl'
          }
        }
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
      .state('addPicture', {
        url: '/addPicture',
        templateUrl: 'templates/addPicture/addPicture.html',
        controller: 'addPictureCtrl'
      })
      .state('createPin', {
        url: '/createPin',
        templateUrl: 'templates/createPin/createPin.html',
        controller: 'createPinCtrl'
      })
      .state('enterPinForeground', {
          url: '/enterPinForeground',
          templateUrl: 'templates/enterPinForeground/enterPinForeground.html',
          controller: 'enterPinForegroundCtrl'
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
    // $urlRouterProvider.otherwise('app/home');
    $urlRouterProvider.otherwise('/login');
  });
