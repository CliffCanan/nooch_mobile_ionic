// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('noochApp', ['ionic', 'ionic.service.core', 'noochApp.controllers', 'noochApp.LoginCtrl', 'noochApp.SignupCtrl',
  'noochApp.historyCtrl', 'noochApp.HomeCtrl', 'noochApp.resetPwdCtrl', 'noochApp.profileCtrl', 'noochApp.MenuCtrl',
  'noochApp.howMuchCtrl', 'noochApp.notificationSettingCtrl', 'noochApp.securitySettingCtrl', 'noochApp.SelectRecipCtrl',
  'noochApp.SettingCtrl', 'noochApp.socialSettingCtrl', 'noochApp.StatisticsCtrl', 'noochApp.transferDetailsCtrl',
  'noochApp.referAfriendCtrl', 'noochApp.enterPin', 'noochApp.createPinCtrl', 'noochApp.uploadIDCtrl', 'noochApp.microDepositCtrl',
  'noochApp.services', 'noochApp.addPicture', 'noochApp.welcome', 'noochApp.mapCtrl', 'noochApp.howItWorksCtrl', 'noochApp.limitsAndFeesCtrl',
  'noochApp.enterPinForegroundCtrl', 'ngCordova', 'ti-segmented-control', 'ngStorage', 'jett.ionic.content.banner',
  'ionic.contrib.ui.hscrollcards', 'ngMap'])


  .run(function ($ionicPlatform, $localStorage, $cordovaDevice, CommonHelper, $cordovaPushV5, $cordovaNetwork, $state,
                 $rootScope, $cordovaGeolocation, $cordovaContacts, CommonServices, $ionicPopup, $cordovaGoogleAnalytics) {

      if (!$localStorage.GLOBAL_VARIABLES)
      {
          console.log("App.js -> Run -> GLOBAL_VARs did not exist, setting defaults now");
          $localStorage.GLOBAL_VARIABLES = {
              IsDemoDone: false, // for displaying tutorial screens to user
              IsRemeberMeEnabled: true, // for remembering user

              IsUserLocationSharedWithNooch: false, // to keep track of location sharing
              UserCurrentLatitude: '0',  // user current lat if shared location
              UserCurrentLongi: '0',  // user current lon if shared location0

              MemberId: '', // MemberId of user -- logged in user
              Pwd: '',
              UserName: '',
              Status: '',
              IsPhoneVerified: false,

              AccessToken: '',
              ip: '',

              IsNotificationPermissionGiven: false,// will store here about push notification permission from user
              DeviceId: '',// this would be unique device id,
              DeviceToken: '', // or notification token.. will be used for sending push notifications from server
              DeviceOS: '',// to save current device operating system info... iOS or Android

              IsNetworkAvailable: false,
              EnterPinImmediately: false, // to check if pin is required while coming back to foreground or app launch

              shouldNotDisplayContactsAlert: false, // to show share contacts alert at various locations.. if true user denied to share contact and we shouldn't ask.
              HasSharedContacts: false, // if true then shouldn't ask for contact permission again
              contactsLength: 0,
              pinValidatorData: {},

              touchId: {
                  isEnabled: false,
                  requireForLogin: false,
                  requireForPayments: false
              }
          };
      }

      if ($localStorage.GLOBAL_VARIABLES.MemberId == '')
      {
          //console.log("App.js -> Run -> MemberId == '' so calling LOGOUT CommonService");
          CommonServices.logOut();
      }

      // Get Screen Width and save in $rootScope for use anywhere
      $rootScope.screenWidth = CommonServices.getScreenWidth();
      $rootScope.screenHeight = CommonServices.getScreenHeight();
      $rootScope.selectRecipContactLength = 0;
      $rootScope.contacts = [];
      $rootScope.homeContactLength = 0;
      $rootScope.homeContacts = [];

      $rootScope.baseNoochWebUrl = 'https://noochme.com/noochweb/Nooch/';
      //$rootScope.baseNoochWebUrl = 'http://nooch.info/noochweb/Nooch/';

      $ionicPlatform.ready(function () {
          // Enable to debug issues.
          // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

          if (typeof analytics !== 'undefined')
          {
              analytics.startTrackerWithId("UA-36976317-2");
          }
          else
          {
              console.warn("GOOGLE ANYALYTICS UNAVAILABLE");
          }

          $rootScope.phoneContacts = [];

          // Fired when the app enters the foreground
          document.addEventListener("resume", function () {
              console.log("App RESUMED");
              console.log($localStorage.GLOBAL_VARIABLES.EnterPinImmediately);

              if ($localStorage.GLOBAL_VARIABLES.MemberId != null)
              {
                  //added this to not asked for PIN before login
                  if ($localStorage.GLOBAL_VARIABLES.EnterPinImmediately == true)
                  {
                      CommonServices.savePinValidationScreenData({ transObj: {}, type: '', returnUrl: 'app.home', returnPage: 'Home', comingFrom: 'Identity' });

                      $state.go('enterPin');
                  }
                  // $state.go('enterPinForeground');
              }
          }, false);


          // this function gets fired when app goes to background
          document.addEventListener("pause", function () {
              console.log("App PAUSED");
          }, false);


          document.addEventListener("deviceready", onDeviceReadyApp, false);

          function onDeviceReadyApp() {

              if (window.cordova)
              {
                  // Get device info... used for handling notifications
                  var device = $cordovaDevice.getDevice();
                  console.log(device);

                  $localStorage.GLOBAL_VARIABLES.DeviceOS = device.platform == "Android" ? "A" : "I";
                  $localStorage.GLOBAL_VARIABLES.DeviceId = device.uuid;

                  console.log('Device OS is: [' + device.platform + '], UUID: [' + device.uuid + ']');


                  // Called when the user taps on a notification
                  var notificationOpenedCallback = function (jsonData) {
                      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
                  };

                  window.plugins.OneSignal.init("fec1f882-0524-49e5-a8f4-1dc0f84cbb00",
                                                {
                                                    googleProjectNumber: "104707683579",
                                                    autoRegister: false
                                                },
                                                notificationOpenedCallback);

                  // Show an alert box if a notification comes in when the user is in your app.
                  window.plugins.OneSignal.enableInAppAlertNotification(true);

                  // Get device notification token for One Signal (Push Notifications)
                  window.plugins.OneSignal.getIds(function (ids) {
                      console.log('App.js --> OneSignal.getIds: [' + JSON.stringify(ids) + ']');

                      $localStorage.GLOBAL_VARIABLES.DeviceToken = ids.pushToken;
                      $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven == true;

                      // console.log("OneSignalUserId UserId: " + ids.userId);
                      // console.log("OneSignalPushToken PushToken: " + ids.pushToken);
                  });

                  /*var isOnline = $cordovaNetwork.isOnline();
                  if (isOnline == true)
                      $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = true;
				  console.log("APP.JS -> CHECKPOINT #1");

                  var isOffline = $cordovaNetwork.isOffline();
                  if (isOffline == true)
                      $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = false;

				  console.log("APP.JS -> CHECKPOINT #2");

                  // listen for Online event
                  $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                      var onlineState = networkState;
                      console.log('Network is ONLINE - ' + JSON.stringify(networkState));
                  });*/

                  // listen for Offline event
                  $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                      var offlineState = networkState;
                      console.log('Network is OFFLINE - ' + JSON.stringify(networkState));
                  })
              }

              setTimeout(function () {
                  navigator.splashscreen.hide();
              }, 100);
          }

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
              StatusBar.styleDefault();

          $rootScope.ionicContentBannerHasHidden = function () {
              //console.log('$rootScope.ionicContentBannerHasHidden FIRED');
              $rootScope.$broadcast('ionicContentBannerHasHidden');
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
        .state('app.howMuch', {
            url: '/selectRecipien/howMuch',
            params: { recip: null },
            views: {
                'menuContent': {
                    templateUrl: 'templates/howMuch/howMuch.html',
                    controller: 'howMuchCtrl'
                }
            }
        })
        .state('enterPin', {
            url: '/enterPin',
            params: { transObj: null, type: null, returnUrl: null, returnPage: null, comingFrom: null },
            templateUrl: 'templates/enterPin/enterPin.html',
            controller: 'enterPinCtrl'
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
        .state('app.transferDetails', {
            url: '/history/transferDetails',
            params: { trans: null },
            views: {
                'menuContent': {
                    templateUrl: 'templates/transferDetails/transferDetails.html',
                    controller: 'transferDetailsCtrl'
                }
            }
        })
        .state('app.settings', {
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
        .state('app.uploadID', {
            url: '/settings/uploadID',
            views: {
                'menuContent': {
                    templateUrl: 'templates/uploadID/uploadID.html',
                    controller: 'uploadIDCtrl'
                }
            }
        })
        .state('app.microDeposit', {
            url: '/settings/microDeposit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/microDeposit/microDeposit.html',
                    controller: 'microDepositCtrl'
                }
            }
        })
        .state('app.notificationSetting', {
            url: '/settings/notificationSetting',
            views: {
                'menuContent': {
                    templateUrl: 'templates/notificationSetting/notificationSetting.html',
                    controller: 'notificationSettingCtrl'
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
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'templates/welcome/welcome.html',
            controller: 'welcomeCtrl'
        })
        .state('enterPinForeground', {
            url: '/enterPinForeground',
            templateUrl: 'templates/enterPinForeground/enterPinForeground.html',
            controller: 'enterPinForegroundCtrl'
        })
        .state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map/map.html',
                    controller: 'mapCtrl'
                }
            }
        })

      $urlRouterProvider.otherwise('/signup');
  });
