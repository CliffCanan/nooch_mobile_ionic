angular.module('noochApp.uploadIDCtrl', ['noochApp.uploadID-service', 'noochApp.services'])

    .controller('uploadIDCtrl', function ($scope, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaImagePicker,
                                          $ionicActionSheet, $ionicContentBanner, $state, $timeout, uploadIDService, CommonServices) {

        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $scope.picSelected = false;
        })


        $scope.$on("$ionicView.enter", function (event, data) {
			$scope.picSelected = false;
            $ionicPlatform.ready(function () {
                if (typeof analytics !== 'undefined') analytics.trackView("Upload ID");
            })
        });


        $scope.choosePhoto = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Choose From Library' },
                    { text: 'Take Photo' }
                ],
                titleText: 'Upload ID',
                cancelText: 'Cancel',
				destructiveText: $scope.picSelected == true ? 'Remove Picture' : null,
                buttonClicked: function (index) {
                    if (index == 0) $scope.choosePhotoFromDevice();
                    else if (index == 1) $scope.takePhoto();

                    return true;
                },
	            destructiveButtonClicked: function () {
                    $scope.picture = null;
                    $scope.imgURI = null;
                    $scope.picSelected = false;
	                return true;
	            }
            });
        }


        $scope.choosePhotoFromDevice = function () {
            $ionicPlatform.ready(function () {
                CommonServices.openPhotoGallery('uploadId', function (result) {
                    if (result != null && result != 'failed')
                    {
                        $scope.picture = result;
                        $scope.imgURI = "data:image/jpeg;base64," + result;
                        $scope.picSelected = true;
                    }
                    else if (result != null && result == 'failed')
                        CommonServices.DisplayError('Unable to access photo gallery :-(');
                });
            });
        }


        $scope.takePhoto = function () {

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


        $scope.sendDoc = function () {
            //console.log('sendDoc Function');

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
                             text: ['Roger that, ID submitted successfully!'],
                             autoClose: '4500',
                             type: 'success',
                             transition: 'vertical',
							 cancelOnStateChange: false,
							 icon: 'ion-close-circled'
                         });
                     }
                     else
                         CommonServices.DisplayError('Unable to upload ID. Please contact support!');


					 $timeout(function () {
						 $state.go('app.settings');
					 }, 1500);
                 })
                 .error(function (error) {
                     console.log('submitDocumentToSynapseV3 Error: [' + JSON.stringify(error) + ']');
                     $ionicLoading.hide();
                     if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                         CommonServices.logOut();
                     else
					 {
                         CommonServices.DisplayError('Unable to upload ID :-(');
						 
						 $timeout(function () {
							 $state.go('app.settings');
						 }, 1500);
					 }
                 })
            //}
            //else
            //    swal("Error", "Internet not connected!", "error");
        }

        $scope.learnMore = function () {
            swal({
                title: "What Gives?",
                text: "To help keep Nooch secure for everyone (and to comply with a variety of state & federal laws, including the PATRIOT ACT), we have to make sure you're not a Soviet spy. &nbsp;Well, actually, any kind of spy.",
                type: "info",
                confirmButtonText: "Ok, Got It!",
                customClass: "singleBtn",
				htmp: true
            });
        }
    })
