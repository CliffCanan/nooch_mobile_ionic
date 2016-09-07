angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, CommonServices, profileService, $ionicLoading, $cordovaImagePicker, $ionicPlatform, $cordovaCamera, $rootScope, $ionicActionSheet) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Add Picture Controller Loaded');

            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
        });


        $scope.choosePhoto = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'From Device Library' },
                    { text: 'Use Camera' }
                ],
                titleText: 'Add Your Picture',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index == 0)
                    {
                        $scope.choosePhotoFromDevice();
                    }
                    else if (index == 1)
                    {
                        $scope.takePhoto();
                    }
                    return true;
                }
            });
        }


        $scope.choosePhotoFromDevice = function () {
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

                    $rootScope.imgURI = imageData;
                    $rootScope.signUpData.Photo = "data:image/jpeg;base64," + imageData;

                    if ($rootScope.signUpData.Photo != null)
                        $state.go('createPin');

                }, function (err) {
                    // An error occured. Show a message to the user
                });
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
                        targetWidth: 300,
                        targetHeight: 300,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };

                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        // console.log(imageData);
                        $rootScope.imgURI = imageData;
                        $rootScope.signUpData.Photo = "data:image/jpeg;base64," + imageData;

                    }, function (err) {
                        // An error occured. Show a message to the user
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
                            });
                        }
                    });
                }
            }, function (error) {
                console.error("isCameraAuthorized Error: [" + error + ']');
            });
        }


        $scope.isUrlUpdated = function () {
            if ($rootScope.signUpData.gotPicUrl == true)
                $rootScope.signUpData.isPicChanged = false;
        }
    });