angular.module('noochApp.profileCtrl', ['noochApp.resetPasswordService', 'noochApp.services'])
.controller('profileCtrl', function ($scope, CommonServices, $state, $ionicHistory, $localStorage) {

    $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log('My Profile page Loadad');
        $scope.MemberDetails();

    })

    $scope.MemberDetails = function () {
        console.log('Entered into memberDetails Function');

        CommonServices.GetMemberDetails($localStorage.GLOBAL_VARIABLES.MemberId)
            .success(function (Details) {
                console.log(Details);
                $scope.Details = Details;
            }
    ).error(function (encError) {
        console.log('came in enc error block ' + encError);
    })
    }

})
