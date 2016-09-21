angular.module('noochApp.services', ['ngStorage'])

// Adding some common usefull services in here like enc, dec etc.
  .service('CommonServices', function ($http, $localStorage, $state, $window, $ionicLoading, $cordovaCamera, $ionicContentBanner) {
      this.GetEncryptedData = function (dataToEncrypt) {
          return $http.get(URLs.GetEncryptedData + '?data=' + btoa(dataToEncrypt)); // btoa DOES THE BASE 64 ENCRYPTION FOR GIVEN INPUT
      }

      this.GetDecryptedData = function (dataToDecrypt) {
          var url = URLs.GetDecryptedData + '?sourceData=' + dataToDecrypt;
          return $http.get(url);
      }

      this.GetMemberIdByUsername = function (userName) {
          return $http.get(URLs.GetMemberIdByUsername + '?userName=' + userName);
      }

      this.GetMemberIdByPhone = function (userPhone) {
          return $http.get(URLs.GetMemberIdByPhone + '?phoneNo=' + userPhone + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      }

      this.GetMemberDetails = function (memberId) {
          return $http.get(URLs.GetMemberDetails + '?memberId=' + memberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      }

      this.logOut = function () {

          $localStorage.GLOBAL_VARIABLES.IsDemoDone = false;
          $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
          $localStorage.GLOBAL_VARIABLES.IsNotificationPermissionGiven = false;

          $localStorage.GLOBAL_VARIABLES.IsPhoneVerified = false;
          $localStorage.GLOBAL_VARIABLES.hasSynapseUserAccount = false;
          $localStorage.GLOBAL_VARIABLES.isBankVerified = false;
          $localStorage.GLOBAL_VARIABLES.isProfileComplete = false;

          $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = "0";
          $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = "0";
          $localStorage.GLOBAL_VARIABLES.MemberId = '';
          if ($localStorage.GLOBAL_VARIABLES.IsRemeberMeEnabled == false)
              $localStorage.GLOBAL_VARIABLES.UserName = '';
          $localStorage.GLOBAL_VARIABLES.AccessToken = '';
          //$localStorage.GLOBAL_VARIABLES.DeviceId = '';
          //$localStorage.GLOBAL_VARIABLES.DeviceToken = '';
          //$localStorage.GLOBAL_VARIABLES.DeviceOS = '';
          $localStorage.GLOBAL_VARIABLES.PhotoUrl =
          $localStorage.GLOBAL_VARIABLES.Status = '';
          $localStorage.GLOBAL_VARIABLES.synBankAllowed = '';
          $localStorage.GLOBAL_VARIABLES.synUserPermission = '';

          //console.log($localStorage.GLOBAL_VARIABLES);

          var destination = 'signup';
          if ($localStorage.GLOBAL_VARIABLES.UserName != '')
              destination = 'login';

          $state.go(destination);
      }

      this.IsDuplicateMember = function (userName) {
          return $http.get(URLs.IsDuplicateMember + '?userName=' + userName);
      }

      this.ValidatePinNumberToEnterForEnterForeground = function (pinNumber) {
          return $http.get(URLs.ValidatePinNumberToEnterForEnterForeground + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&pinNo=' + pinNumber + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      }

      this.ValidatePinNumber = function (pinNumber) {
          return $http.get(URLs.ValidatePinNumber + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&pinNo=' + pinNumber + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      }

      this.GetMemberDetails = function () {
          return $http.get(URLs.GetMemberDetails + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
      }

      this.savePinValidationScreenData = function (data) {
          console.log(data);
          $localStorage.GLOBAL_VARIABLES.pinValidatorData = data;
      }

      this.getPinValidationScreenData = function () {
          return $localStorage.GLOBAL_VARIABLES.pinValidatorData;
      }

      this.getScreenWidth = function () {
          return $window.innerWidth;
      }

      this.getScreenHeight = function () {
          return $window.innerHeight;
      }

      this.ResendVerificationLink = function () {
          return $http.get(URLs.ResendVerificationLink + '?UserName=' + $localStorage.GLOBAL_VARIABLES.UserName);
      };

      this.ResendVerificationSMS = function () {
          return $http.get(URLs.ResendVerificationSMS + '?UserName=' + $localStorage.GLOBAL_VARIABLES.UserName);
      };

      this.ValidateEmail = function (str) {
          if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str))
              return (true)
          else
              return (false)
      }

      this.openPhotoGallery = function (from, callback) {
          console.log("CommonServices -> openPhotoGallery - From: [" + from + "]");

          var targetWidthHeight = 300;
          var alertBodyText = "";

          if (from == 'addPicture' || from == 'profile')
          {
              alertBodyText = "To add a profile picture from your photo gallery, please grant Nooch access to your photos.";
          }
          else if (from == 'howMuch')
          {
              // CC (9/15/16): For transactions, the image could be more meaningful (to the user), so let's capture a slightly larger image
              targetWidthHeight = 400;
              alertBodyText = "To attach a picture from your photo gallery, please grant Nooch access to your photos.";
          }
          else if (from == 'uploadId')
          {
              targetWidthHeight = 500;
              alertBodyText = "To upload a picture of your ID, please grant access to your photo gallery.";
          }

          var options = {
              quality: 80,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: targetWidthHeight,
              targetHeight: targetWidthHeight,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
          };

          if ($localStorage.GLOBAL_VARIABLES.DeviceOS == "I") // iOS
          {
              cordova.plugins.diagnostic.isCameraRollAuthorized(function (authorized) {
                  console.log("App is " + (authorized ? "authorized" : "denied") + " access to the Photo Gallery");

                  if (authorized)
                  {
                      $cordovaCamera.getPicture(options).then(function (imgData) {
                          //console.log('Got picture successfully (was already authorized)');
                          callback(imgData);
                      }, function (err) {
                          console.log(err);
                          if (err != null) callback(err)
                          else callback('failed');
                      });
                  }
                  else
                  {
                      swal({
                          title: "Allow Photo Gallery Access",
                          text: alertBodyText,
                          type: "info",
                          confirmButtonText: "Give Access",
                          showCancelButton: true,
                          cancelButtonText: "Not Now"
                      }, function (isConfirm) {
                          if (isConfirm)
                          {
                              cordova.plugins.diagnostic.requestCameraRollAuthorization(function (status) {
                                  console.log("Authorization request for camera use was: [" + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted]" : "denied]"));
                                  if (status)
                                  {
                                      $cordovaCamera.getPicture(options).then(function (imgData) {
                                          console.log('Got picture successfully (was NOT previously authorized)');
                                          callback(imgData);
                                      }, function (err) {
                                          if (err != null) callback(err)
                                          else callback('failed');
                                      });
                                  }
                              }, function (error) {
                                  console.error(error);
                                  callback('failed');
                              });
                          }
                      });
                  }
              });
          }
              // If Android
          else if ($localStorage.GLOBAL_VARIABLES.DeviceOS == "A")
          {
              // CC (9/15/16) Apparently there is no Android method equivalent to isCameraRollAuthorized()... so just skip the Nooch alert and open the Gallery. (https://www.npmjs.com/package/cordova.plugins.diagnostic)

              $cordovaCamera.getPicture(options).then(function (imgData) {
                  callback(imgData);
              }, function (err) {
                  console.log(err);
                  callback('failed');
              });
          }
      }

      this.DisplayError = function (text) {
          $ionicContentBanner.show({
              text: ['Error - ' + text],
              autoClose: '4500',
              type: 'error',
              icon: 'ion-close-circled'
          });
      }
  })


  .factory('CommonHelper', function ($localStorage) {
      // reading local settings of user
      return {
          getValueOfGiveKeyFromLocalSettings: function (keyName) {
              if ($localStorage.GLOBAL_VARIABLES.length > 0)
                  return _.get(_.find($localStorage.GLOBAL_VARIABLES, keyName), keyName);
              else return undefined;

          },
          setValueOfGiveKeyFromLocalSettings: function (keyName, valueToSet) {
              return _.set($localStorage.GLOBAL_VARIABLES, keyName, valueToSet);
          }
      }
  })


  .factory('Chats', function () {
      // Might use a resource here that returns a JSON array

      // Some fake testing data
      var chats = [{
          id: 0,
          name: 'Ben Sparrow',
          lastText: 'You on your way?',
          face: 'img/ben.png'
      }, {
          id: 1,
          name: 'Max Lynx',
          lastText: 'Hey, it\'s me',
          face: 'img/max.png'
      }, {
          id: 2,
          name: 'Adam Bradleyson',
          lastText: 'I should buy a boat',
          face: 'img/adam.jpg'
      }];

      return {
          all: function () {
              return chats;
          },
          remove: function (chat) {
              chats.splice(chats.indexOf(chat), 1);
          },
          get: function (chatId) {
              for (var i = 0; i < chats.length; i++)
              {
                  if (chats[i].id === parseInt(chatId))
                  {
                      return chats[i];
                  }
              }
              return null;
          }
      };
  });
