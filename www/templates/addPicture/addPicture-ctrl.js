angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, CommonServices, profileService, $ionicLoading, $cordovaImagePicker, $ionicPlatform, $cordovaCamera, $rootScope) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Add Picture Controller Loaded');

            console.log($rootScope.signUpData);

            if ($rootScope.signUpData == null)
                $state.go('signup');
        });


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
                    //console.log('imagedata --- ');
                    //console.log(imageData);

                    $scope.imgURI = "data:image/jpeg;base64," + imageData;

                    //var binary_string = window.atob(imageData);  Surya:09-Aug-16 No need To convert In to Byte Array
                    //var len = binary_string.length;
                    //var bytes = new Uint8Array(len);
                    //for (var i = 0; i < len; i++) {
                    //    bytes[i] = binary_string.charCodeAt(i);
                    //}
                    // $scope.Details.picture = bytes;
                    //console.log(bytes);

                    $rootScope.signUpData.Photo = imageData;

                    if ($rootScope.signUpData.Photo != null)
                        $state.go('createPin');

                }, function (err) {
                    // An error occured. Show a message to the user
                });
            });
        }


        $scope.isUrlUpdated = function () {
            if ($rootScope.signUpData.gotPicUrl == true)
                $rootScope.signUpData.isPicChanged = false;
        }
    });