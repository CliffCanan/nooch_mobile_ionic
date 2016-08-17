// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('noochApp', ['ionic','ionic.service.core',  'noochApp.controllers', 'noochApp.LoginCtrl', 'noochApp.SignupCtrl', 'noochApp.historyCtrl',
  'noochApp.HomeCtrl', 'noochApp.resetPwdCtrl', 'noochApp.profileCtrl', 'noochApp.MenuCtrl', 'noochApp.howMuchCtrl', 'noochApp.notificationSettingCtrl',
  'noochApp.securitySettingCtrl', 'noochApp.SelectRecipCtrl', 'noochApp.SettingCtrl', 'noochApp.socialSettingCtrl', 'noochApp.StatisticsCtrl',
  'noochApp.TransferDetailsCtrl', 'noochApp.referAfriendCtrl','noochApp.enterPin', 'noochApp.createPinCtrl', 'noochApp.services',
  'noochApp.addPicture', 'noochApp.mapCtrl', 'noochApp.howItWorksCtrl', 'noochApp.limitsAndFeesCtrl', 'noochApp.enterPinForegroundCtrl', 'noochApp.addBankCtrl', 'ngCordova', 'ti-segmented-control', 'ngStorage', 'jett.ionic.content.banner', 'ionic.contrib.ui.hscrollcards', 'ngMap'])


  .run(function ($ionicPlatform, $localStorage, $cordovaDevice, CommonHelper, $cordovaPushV5, $cordovaNetwork, $state, $rootScope, $cordovaGeolocation, $cordovaContacts, CommonServices) {



      if (!$localStorage.GLOBAL_VARIABLES) {
          $localStorage.GLOBAL_VARIABLES = {
              IsDemoDone: false, // for displaying tutorial screens to user - if any
              IsRemeberMeEnabled: false, // for remembering user

              IsUserLocationSharedWithNooch: false, // to keep track of location sharing
              UserCurrentLatitude: '',  // user current lat if shared location
              UserCurrentLongi: '',  // user current lon if shared location0

              MemberId: '', // MemberId of user -- logged in user
              Pwd: '',
              UserName: '',
              Status: '',
              IsPhoneVerified: false,

              AccessToken: '',

              IsNotificationPermissionGiven: false,// will store here about push notification permission from user
              DeviceId: '',// this would be unique device id,
              DeviceToken: '', // or notification token.. will be used for sending push notifications from server
              DeviceOS: '',// to save current device operating system info... iOS or Android

              IsNetworkAvailable: false,
              EnterPinImmediately: false, // to check if pin is required while coming back to foreground or app launch

              shouldNotDisplayContactsAlert: false, // to show share contacts alert at various locations.. if true user denied to share contact and we shouldn't ask.
              HasSharedContacts: false, // if true then shouldn't ask for contact permission again
              //pinValidatorData: { myParam: '', type: '', returnUrl: '', returnPage: '', comingFrom: '' }
              pinValidatorData: { }
          };
      }
      $ionicPlatform.ready(function () {
          console.log('app run');

          var push = new Ionic.Push({
              "debug": true
          });

          push.register(function (token) {
              console.log("Device token:", token.token);
              push.saveToken(token);  // persist the token in the Ionic Platform
          });


          $rootScope.phoneContacts = [];
          var readContact =
                              {
                                  FirstName: '',
                                  UserName: '',
                                  ContactNumber: '',
                                  Photo: '',
                                  id: '',
                                  bit: ''
                              };

          function onSuccess(contacts) {

              console.log(contacts);
              for (var i = 0; i < contacts.length; i++) {
                  var contact = contacts[i];

                  readContact.FirstName = contact.name.formatted;
                  readContact.id = i;
                  readContact.bit = 'p';
                  if (contact.emails != null)
                      readContact.UserName = contact.emails[0].value;
                  if (contact.phoneNumbers != null)
                      readContact.ContactNumber = contact.phoneNumbers[0].value;
                  if (contact.photos != null)
                      readContact.Photo = contact.photos[0].value;
                  $rootScope.phoneContacts.push(readContact);

                  readContact =
                              {
                                  FirstName: '',
                                  UserName: '',
                                  ContactNumber: '',
                                  Photo: '',
                                  id: ''
                              };
              }

              console.log($rootScope.phoneContacts);
          };

          function onError(contactError) {
              console.log(contactError);
          };

          var options = {};
          options.multiple = true;

          $cordovaContacts.find(options).then(onSuccess, onError);


          // this functino will gets fired when app comes to foreground
          document.addEventListener("resume", function () {
              console.log('came in resume state');

              if ($localStorage.GLOBAL_VARIABLES.MemberId != null) {
                  //added this to not asked for Pin before login

                  if ($localStorage.GLOBAL_VARIABLES.EnterPinImmediately == true) {
                      CommonServices.savePinValidationScreenData({ myParam: {}, type: '', returnUrl: 'app.home', returnPage: 'Home', comingFrom: 'Identity' });

                      $state.go('enterPin');
                  }
                     // $state.go('enterPinForeground');
              }
          }, false);

          // this function gets fired when app goes to background
          document.addEventListener("pause", function () {
              console.log('came in pause state');
              $localStorage.GLOBAL_VARIABLES.EnterPinImmediately = true;
          }, false);


          if (window.cordova) {
              // Get device info... will be used for handling notifications

              var device = $cordovaDevice.getDevice();

              $localStorage.GLOBAL_VARIABLES.DeviceOS = device.platform;
              $localStorage.GLOBAL_VARIABLES.DeviceId = device.uuid;

              // Settings for handling push notification
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

                  console.log('Reveived notification, notification data -> ' + JSON.stringify(data));
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
                   // $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = position.coords.latitude
                    //$localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = position.coords.longitude
                    console.log('$cordovaGeolocation success -> Lat/Long: [' + lat + ', ' + long + ']');

                    $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = true;

                }, function (err) {
                    // error
                    console.log('$cordovaGeolocation error ' + JSON.stringify(err));

                    $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                });


              var isOnline = $cordovaNetwork.isOnline();
              if (isOnline == true)
                  $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = true;

              var isOffline = $cordovaNetwork.isOffline();
              if (isOffline == true)
                  $localStorage.GLOBAL_VARIABLES.IsNetworkAvailable = false;

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

          if (window.StatusBar)
              StatusBar.styleDefault();
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
            params: { myParam: null },
            views: {
                'menuContent': {
                    templateUrl: 'templates/howMuch/howMuch.html',
                    controller: 'howMuchCtrl'
                }
            }
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
                    templateUrl: 'templates/notificationSetting/notificationSetting.html',
                    controller: 'notificationSettingCtrl'
                }
            }
        })
         .state('app.addBank', {
             url: '/settings/addBank',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/addBank/addBank.html',
                     controller: 'addBankCtrl'
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
            params: { myParam: null, type: null, returnUrl: null, returnPage: null,comingFrom:null },
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

        .state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map/map.html',
                    controller: 'mapCtrl'
                }
            }
        })

      // $urlRouterProvider.otherwise('app/home');
      $urlRouterProvider.otherwise('/login');
  });
