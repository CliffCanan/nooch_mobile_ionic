angular.module('noochApp.socialSettingCtrl', ['noochApp.services'])

.controller('socialSettingCtrl', function ($scope, authenticationService, $state, $ionicHistory, $localStorage) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('Social Setting Controller Loadad');


        $scope.socialSetting = {
            Name: '',
            Email: '',
            Password: '',
            Photo: '',
            Pin: '',
            rmmbrMe: {
                chk: true
            },
            FBId: ''
        };



    })
    
    $scope.connectFb = function () {

        console.log('came in sign in with fb Social Setting page');

        if (!window.cordova) {

            facebookConnectPlugin.browserInit("198279616971457");
        }

        facebookConnectPlugin.login(['email','public_profile'], function (response) {

            console.log('login response from fb ' + JSON.stringify(response));
            $scope.fbStatus = _.get(response, 'status');

            facebookConnectPlugin.api("/me?fields=name,email,picture.type(large)", ['email'], function (success) {
                // success
                console.log('got this from fb ' + JSON.stringify(success));

                $scope.socialSetting.Email = _.get(success, 'email');
                $scope.socialSetting.Name = _.get(success, 'name');
                $scope.socialSetting.Photo = _.get(success, 'picture.data.url');
                $scope.socialSetting.FBId = _.get(success, 'id');

                //$scope.$apply();

               
                if ($scope.fbStatus == 'connected')
                    $scope.fbStatus = 'YES';

                authenticationService.SaveMembersFBId($localStorage.GLOBAL_VARIABLES.MemberId, $scope.socialSetting.FBId, $scope.fbStatus)
                                  .success(function (responce) {
                                      console.log('SaveMembersFBId got success responce');
                                      console.log(responce);
                                      if (responce.Result == Success)
                                      swal("Success", "Facebook Connected Successfully", "success");
                                  }).error(function (responce) {
                                      console.log('Got an error while saveMemberFBId');
                                      console.log(responce);
                                      swal("Oops..", "Something went wrong", "error");
                                  })
                              

                console.log('Here is my root scope object' + JSON.stringify($rootScope.signupData));

            }, function (error) {
                // error
                console.log(error);
            });

        });
    }


})




