angular.module('noochApp.uploadIDCtrl', ['noochApp.uploadID-service', 'noochApp.services'])

       .controller('uploadIDCtrl', function ($scope, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, uploadIDService) {

           $scope.$on("$ionicView.enter", function (event, data) {

               console.log('uloadID Ctrl loaded');
           })

           $scope.takePhoto = function () {
               console.log($cordovaCamera);
               cordova.plugins.diagnostic.isCameraAuthorized(function (authorized) {
                   console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");

                   if (authorized) {
                       var options = {
                           quality: 75,
                           destinationType: Camera.DestinationType.DATA_URL,
                           sourceType: Camera.PictureSourceType.CAMERA,
                           allowEdit: true,
                           encodingType: Camera.EncodingType.JPEG,
                           targetWidth: 300,
                           targetHeight: 300,
                           popoverOptions: CameraPopoverOptions,
                           saveToPhotoAlbum: false
                       };

                       $cordovaCamera.getPicture(options).then(function (imageData) {
                           console.log(imageData);
                           $scope.imgURI = "data:image/jpeg;base64," + imageData;
                           var binary_string = window.atob(imageData);
                           var len = binary_string.length;
                           var bytes = new Uint8Array(len);
                           for (var i = 0; i < len; i++) {
                               bytes[i] = binary_string.charCodeAt(i);
                           }
                           $scope.picture = imageData;
                           console.log(bytes);
                           $scope.sendDoc($scope.picture);
                       }, function (err) {
                           // An error occured. Show a message to the user
                       });
                   }
                   else {
                       swal({
                           title: "Permissions not Granted!",
                           text: "Please click OK for allowing Nooch to access camera",
                           type: "warning",
                           showCancelButton: true,
                           cancelButtonText: "Cancel",
                           confirmButtonColor: "#3fabe1",
                           confirmButtonText: "Ok",
                           customClass: "stackedBtns"
                       }, function (isConfirm) {
                           if (isConfirm) {
                               cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                                   console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                                   if (status) {
                                       $scope.takePhoto();
                                   }

                               }, function (error) {
                                   console.error(error);
                               });
                           }
                       });
                   }
               }, function (error) {
                   console.error("The following error occurred: " + error);
               });
           }


           $scope.choosePhoto = function () {
               $ionicPlatform.ready(function () {
                   var options = {
                       quality: 75,
                       destinationType: Camera.DestinationType.DATA_URL,
                       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                       allowEdit: true,
                       encodingType: Camera.EncodingType.JPEG,
                       targetWidth: 300,
                       targetHeight: 300,
                       popoverOptions: CameraPopoverOptions,
                       saveToPhotoAlbum: false
                   };

                   $cordovaCamera.getPicture(options).then(function (imageData) {
                       console.log(imageData);
                       $scope.picture = imageData;
                       $scope.imgURI = "data:image/jpeg;base64," + imageData;
                       $scope.sendDoc($scope.picture);
                   }, function (err) {
                       // An error occured. Show a message to the user
                   });
               });
           }

           $scope.sendDoc = function (picture) {
               console.log('sendDoc Function');
               //if ($cordovaNetwork.isOnline()) {
               $ionicLoading.show({
                   template: 'Sending Doc ...'
               });
               uploadIDService.submitDocumentToSynapseV3($scope.picture)
                       .success(function (data) {
                           console.log(data);
                           $scope.Data = data.Result;
                           $ionicLoading.hide();
                           $scope.data = data;
                       }
               ).error(function (encError) {
                   console.log('came in enc error block ' + encError);
                   $ionicLoading.hide();
                   //  if (encError.ExceptionMessage == 'Invalid OAuth 2 Access')
                   { CommonServices.logOut(); }
               })
               //}
               //else {
               //    swal("Oops...", "Internet not connected!", "error");
               //}
           }

       })
