angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, CommonServices, profileService, $ionicLoading, $cordovaImagePicker, $ionicPlatform, $cordovaCamera) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');
            $scope.memberDetails();
            //$("#pin").focus();
        });

        $scope.memberDetails = function () {
            //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading ...'
            });

            CommonServices.GetMemberDetails()
              .success(function (data) {
                  $scope.Data = data;

                  console.log($scope.Data);
                  $ionicLoading.hide();
              }).error(function (data) {
                  console.log('eror' + data);
                  $ionicLoading.hide();
              });
            //  }
            //else {
            //    swal("Oops...", "Internet not connected!", "error");
            //}        
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
                    console.log('imagedata --- ');
                    console.log(imageData);
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    console.log('after converting base 64 imgURL');
                    console.log($scope.imgURI);


                    //var binary_string = window.atob(imageData);  for converting in bytes
                    //var len = binary_string.length;
                    //var bytes = new Uint8Array(len);
                    //for (var i = 0; i < len; i++) {
                    //    bytes[i] = binary_string.charCodeAt(i);
                    //}
                    //$scope.Details.picture = imageData;
                    //console.log(bytes);

                  //  $scope.Details.Picture = imageData;
                    $scope.Details.Photo = imageData;

                    $scope.UpdatePhoto();
                  

                }, function (err) {
                    // An error occured. Show a message to the user
                });
            });
        }


        $scope.UpdatePhoto = function () {
            console.log(' UpdatePhoto Function Touched');
            //if ($cordovaNetwork.isOnline()) {
            $ionicLoading.show({
                template: 'Loading ...'
            });

            console.log('Values from UpdatePhoto function Page...');
            console.log($scope.Details);

            profileService.MySettings($scope.Details)
                .success(function (data) {
                    console.log(data);
                    $scope.Data = data;
                    console.log('from UpdateProfile function');                   
                    $ionicLoading.hide();
                }
        ).error(function (encError) {
            console.log('came in enc error block ' + encError);
            $ionicLoading.hide();
        })
            //}
            //else {
            //    swal("Oops...", "Internet not connected!", "error");
            //}
        }


    });
