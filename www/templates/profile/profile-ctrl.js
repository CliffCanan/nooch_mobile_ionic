angular.module('noochApp.profileCtrl', ['noochApp.profile-service', 'noochApp.services', 'ngCordova'])
.controller('profileCtrl', function ($scope, CommonServices, profileService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicLoading, $cordovaDatePicker, $cordovaImagePicker, $ionicPlatform, $cordovaCamera) {
     

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
        $scope.MemberDetails();

    })

    $scope.MemberDetails = function () {
        console.log('memberDetails Function Touched');
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        profileService.GetMyDetails()
                .success(function (details) {
                    console.log(details);
                    $scope.Details = details;                                

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



    $scope.UpdateProfile = function () {
        console.log('Update Profile Function Touched');
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });

      //console.log('Values from Profile.html Page...');       
      console.log($scope.Details);
      
        profileService.MySettings($scope.Details)
            .success(function (data) {
                console.log(data);
                $scope.Data = data;
                console.log('from UpdateProfile function');
                $scope.saveDob($scope.Details.DateOfBirth);
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

     //date Picker Plugin 
    $scope.showdate = function () {
        
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: 0,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };       
        
        document.addEventListener("deviceready", function () {
            
            $cordovaDatePicker.show(options).then(function (date) {
              //  alert(date);
                $scope.Details.DateOfBirth = date;
                if ($scope.Details.DateOfBirth != null) {
                 //   $scope.saveDob($scope.Details.DateOfBirth);
                    console.log('from showdate function');
                    console.log($scope.Details.DateOfBirth);                   
                }
            });

        }, false);

    }


    $scope.saveDob= function(DateOfBirth){
        console.log('saveDob Function Touched');
        console.log($scope.Details.DateOfBirth);
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Loading ...'
        });
        profileService.SaveDOBForMember($scope.Details.DateOfBirth)
                .success(function (details) {
                    console.log(details);

                    if (details.Result == 'DOB saved successfully.')
                    {
                        swal("Yup..", "Profile Updated", "success");
                    }
                    else {
                        swal("Oops...", "Something Went Wrong", "error");
                    }

                    $scope.Details = details;                                

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

                             
                var binary_string = window.atob(imageData);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                $scope.Details.picture = imageData;
                console.log(bytes);

                $scope.Details.Picture = imageData;
                $scope.Details.Photo = imageData;

            }, function (err) {
                // An error occured. Show a message to the user
            });
        });
    }
  
})
