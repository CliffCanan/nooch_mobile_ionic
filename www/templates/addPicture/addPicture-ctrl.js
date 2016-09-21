angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, $ionicLoading, $localStorage, $cordovaImagePicker, $ionicPlatform, $cordovaCamera,
											$rootScope, $ionicActionSheet, $cordovaGoogleAnalytics, CommonServices, profileService) {


        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            //console.log('Add Picture Controller Loaded');

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
                    { text: 'Choose From Library' },
                    { text: 'Take Photo' }
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
            // CC (9/15/16): Apparently isCameraRollAuthorized() is only for iOS... so need to check to see which platform the user is on.

            $ionicPlatform.ready(function () {
                CommonServices.openPhotoGallery('addPicture', function (result) {
                    if (result != null)
					{
						if (result == 'failed')
	                    {
	                        console.log("ADD - PICTURE - failure FROM COMMONSERVICES [" + result + "]");
	                        CommonServices.DisplayError('Unable to get picture from the photo gallery :-(');
	                    }
						else if (result != 'no image selected')
	                    {
	                        $rootScope.signUpData.Photo = "data:image/jpeg;base64," + result;
	                        $scope.showContinueBtn = true;
	                    }
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
                        CommonServices.DisplayError('Unable to get picture from the camera :-(');
                    });
                }
                else
                {
                    swal({
                        title: "Allow Camera Access",
                        text: "This lets you take a picture to use for your profile.",
                        type: "info",
                        confirmButtonText: "Give Access",
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
                                CommonServices.DisplayError('Unable to get picture from the camera :-(');
                            });
                        }
                    });
                }
            }, function (error) {
                console.error("isCameraAuthorized Error: [" + error + ']');
                CommonServices.DisplayError('Unable to get picture from the camera :-(');
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