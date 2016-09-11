angular.module('noochApp.uploadIDCtrl', ['noochApp.uploadID-service', 'noochApp.services'])

       .controller('uploadIDCtrl', function ($scope, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet, $ionicContentBanner, uploadIDService) {

           $scope.$on("$ionicView.beforeEnter", function (event, data) {
               console.log('uploadIDCtrl loaded');
               $scope.picSelected = false;
           })


           $scope.choosePhoto = function () {
               var hideSheet = $ionicActionSheet.show({
                   buttons: [
                       { text: 'From Device Library' },
                       { text: 'Use Camera' }
                   ],
                   titleText: 'Upload ID',
                   cancelText: 'Cancel',
                   buttonClicked: function (index) {
                       if (index == 0) $scope.choosePhotoFromDevice();
                       else if (index == 1) $scope.takePhoto();

                       return true;
                   }
               });
           }


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
                           targetWidth: 400,
                           targetHeight: 400,
                           popoverOptions: CameraPopoverOptions,
                           saveToPhotoAlbum: false
                       };

                       $cordovaCamera.getPicture(options).then(function (imageData) {
                           $scope.imgURI = "data:image/jpeg;base64," + imageData;
                           $scope.picture = imageData;                           
                           $scope.picSelected = true;
                       }, function (error) {
                           // An error occured. Show a message to the user
						   console.log("takePhoto() --> $cordovaCamera.getPicture Error: [" + JSON.stringify(error) + "]");
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


           $scope.choosePhotoFromDevice = function () {
               cordova.plugins.diagnostic.getCameraRollAuthorizationStatus(function(status){               
                   console.log("Authorization request for camera roll was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
               
                   if (status)
				   {
                       $ionicPlatform.ready(function () {
                           var options = {
                               quality: 75,
                               destinationType: Camera.DestinationType.DATA_URL,
                               sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                               allowEdit: true,
                               encodingType: Camera.EncodingType.JPEG,
                               targetWidth: 400,
                               targetHeight: 400,
                               popoverOptions: CameraPopoverOptions,
                               saveToPhotoAlbum: false
                           };

                           $cordovaCamera.getPicture(options).then(function (imageData) {
                               $scope.picture = imageData;
                               $scope.imgURI = "data:image/jpeg;base64," + imageData;
                               $scope.picSelected = true;
                           }, function (error) {
                               console.log("choosePhotoFromDevice() --> $cordovaCamera.getPicture Error: [" + JSON.stringify(error) + "]");
                           });
                       });
                   }
                   else
				   {
					   swal({
                           title: "Allow Camera Roll Access",
                           text: "To upload a picture of your ID, please grant access to your photo gallery.",
                           type: "warning",
                           showCancelButton: true,
                           cancelButtonText: "Not Now",
                           confirmButtonColor: "#3fabe1",
                           confirmButtonText: "Give Access",
                       }, function (isConfirm) {
                           if (isConfirm) {
                               cordova.plugins.diagnostic.requestCameraRollAuthorization(function (status) {
                                   console.log("Authorization request for camera roll was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                                   if (status)
                                       $scope.choosePhoto();
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

			   		    if (data.isSuccess == true)
						{
			   		        $ionicContentBanner.show({
			   		            text: ['Your ID uploaded Successfully'],
			   		            autoClose: '5000',
			   		            type: 'success',
			   		            transition: 'vertical'
			   		        });
				   		 }
				   		 else 
						 {
				   		     $ionicContentBanner.show({
				   		         text: ['Somethig went wrong'],
				   		         autoClose: '5000',
				   		         type: 'error',
				   		         transition: 'vertical'
				   		     });
				   		 }
			   		})
					.error(function (error) {
				       console.log('submitDocumentToSynapseV3 Error: [' + JSON.stringify(error) + ']');
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
