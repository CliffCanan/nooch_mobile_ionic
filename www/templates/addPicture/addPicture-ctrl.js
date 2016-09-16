angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaImagePicker, $ionicPlatform, $cordovaCamera,
											$rootScope, $ionicActionSheet, $cordovaGoogleAnalytics, CommonServices, profileService) {


        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            console.log('Add Picture Controller Loaded');

            //console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');

            if ($scope.showContinueBtn == null) $scope.showContinueBtn = false;

            $ionicPlatform.ready(function () {
                if (typeof analytics !== 'undefined') analytics.trackView("Signup Flow - Add Picture");
            })
        });


        $scope.choosePhoto = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'From Photo Library' },
                    { text: 'Use Camera' }
                ],
                titleText: 'Add Your Picture',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index == 0)
						$scope.choosePhotoFromDevice();
                    else if (index == 1)
						$scope.takePhoto();

                    return true;
                }
            });
        }


        $scope.choosePhotoFromDevice = function () {
			// CC (9/15/16): Apparently isCameraRollAuthorized() is only for iOS... so need to add a check to see which platform the user is on.
			
			$ionicPlatform.ready(function () {
				CommonServices.openPhotoGallery('addPicture', function (result) {
					if (result != null && result != 'failed')
					{
						console.log("ADD - PICTURE - SUCCESS FROM COMMONSERVICES")
		                $rootScope.signUpData.Photo = "data:image/jpeg;base64," + result;

		                $scope.showContinueBtn = true;
					}
					else
					{
						console.log("ADD - PICTURE - failure FROM COMMONSERVICES [" + result + "]");
		                $scope.showErrorBanner('photo gallery');
					}
				});
			});
        }



        $scope.takePhoto = function () {

            cordova.plugins.diagnostic.isCameraAuthorized(function (authorized) {
				console.log(authorized);
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
                        $rootScope.signUpData.Photo = "data:image/jpeg;base64," + imageData;

                        $scope.showContinueBtn = true;
                    }, function (error) {
						console.log(error);
						$scope.showErrorBanner('camera');
                    });
                }
                else
                {
                    swal({
                        title: "Allow Camera Access",
                        text: "This lets you take a picture to use for your profile.",
                        type: "info",
                        confirmButtonText: "Give Access",
                        confirmButtonColor: "#3fabe1",
                        showCancelButton: true,
                        cancelButtonText: "Not Now"
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                                console.log("Authorization request for camera use was: [" + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted]" : "denied]"));
                                if (status)
                                    $scope.takePhoto();
                            }, function (error) {
                                console.error(error);
								$scope.showErrorBanner('camera');
                            });
                        }
                    });
                }
            }, function (error) {
                console.error("isCameraAuthorized Error: [" + error + ']');
				$scope.showErrorBanner('camera');
            });
        }


		$scope.showErrorBanner = function(id) {
	        $ionicContentBanner.show({
	            text: ['Error - Unable to get picture from the ' + id + ' :-('],
	            autoClose: 4000,
	            type: 'error',
	            transition: 'vertical'
	        });
		}


        $scope.resetPicData = function () {
			$rootScope.signUpData.FbPicUrl = null;
            $rootScope.signUpData.Photo = null;
        }


        $scope.continue = function () {
            $state.go('createPin');
        }
    });