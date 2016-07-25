angular.module('noochApp.referAfriend-service', ['ngStorage'])

.service('ReferralCodeService', function ($http, $localStorage) {
    this.getReferralCode = function () {
        return $http.post(URLs.getReferralCode + '?memberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
    }


    this.getInvitedMemberList = function () {
        return $http.post(URLs.getInvitedMemberList + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken);
    }

})
