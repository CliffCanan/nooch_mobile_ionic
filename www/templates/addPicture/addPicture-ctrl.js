angular.module('noochApp.addPicture', ['noochApp.services'])

    .controller('addPictureCtrl', function ($scope, $state, CommonServices, profileService, $ionicLoading, $cordovaImagePicker, $ionicPlatform, $cordovaCamera, $rootScope) {

        $scope.$on("$ionicView.enter", function (event, data) {
            console.log('Enter Pin Controller loaded');


            console.log('From addpicture page');

            console.log($rootScope.signupData);



            //$scope.memberDetails();
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
                   
                  console.log('eror' + data.ExceptionMessage);
                  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                  { CommonServices.logOut();}
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

                    $rootScope.signupData.Photo = imageData;

                    if ($rootScope.signupData.Photo != null) {
                        $state.go('createPin');
                    }

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
            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
            { CommonServices.logOut(); }
        })
            //}
            //else {
            //    swal("Oops...", "Internet not connected!", "error");
            //}
        }


    });
