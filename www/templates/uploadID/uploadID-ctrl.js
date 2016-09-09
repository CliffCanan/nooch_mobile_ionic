angular.module('noochApp.uploadIDCtrl', ['noochApp.uploadID-service', 'noochApp.services'])

       .controller('uploadIDCtrl', function ($scope, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, uploadIDService) {

           $scope.$on("$ionicView.beforeEnter", function (event, data) {
               console.log('uploadIDCtrl loaded');
               $scope.picSelected = false;
           })


           $scope.takePhoto = function () {
               console.log($cordovaCamera);
               cordova.plugins.diagnostic.isCameraAuthorized(function (authorized) {
                   console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");

                   if (authorized)
                   {
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
                           for (var i = 0; i < len; i++)
                           {
                               bytes[i] = binary_string.charCodeAt(i);
                           }
                           $scope.picture = imageData;
                           console.log(bytes);
                           $scope.sendDoc($scope.picture);
                       }, function (err) {
                           // An error occured. Show a message to the user
                       });
                   }
                   else
                   {
                       swal({
                           title: "Allow Camera Access",
                           text: "To take a picture of your ID, please grant access to your phone's camera.",
                           type: "warning",
                           showCancelButton: true,
                           cancelButtonText: "Not Now",
                           confirmButtonColor: "#3fabe1",
                           confirmButtonText: "Give Access",
                       }, function (isConfirm) {
                           if (isConfirm)
                           {
                               cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                                   console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                                   if (status)
                                       $scope.takePhoto();
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
                       $scope.picSelected = false;
                   }, function (err) {
                       // An error occured. Show a message to the user
                   });
               });
           }


           $scope.sendDoc = function () {
               console.log('sendDoc Function');

               //if ($cordovaNetwork.isOnline()) {
               $ionicLoading.show({
                   template: 'Submitting ID...'
               });

               uploadIDService.submitDocumentToSynapseV3($scope.picture)
			   		.success(function (data) {
			   		    console.log(data);                        
			   		    $ionicLoading.hide();
			   		})
				   .error(function (error) {
				       console.log('submitDocumentToSynapseV3 Error: [' + encError + ']');
				       $ionicLoading.hide();
				       if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
				           CommonServices.logOut();
				   })
               //}
               //else
               //    swal("Oops...", "Internet not connected!", "error");
           }


           $scope.learnMore = function () {
               swal({
                   title: "What Gives?",
                   text: "To help keep Nooch secure for everyone (and to comply with a variety of state & federal laws), we have to make sure you're not a Soviet spy. &ngsp;Well, actually, any kind of spy.",
                   type: "info",
                   confirmButtonColor: "#3fabe1",
                   confirmButtonText: "Oh ok",
                   customClass: "singleBtn"
               });
           }
       })
