angular.module('noochApp.statistics-service', ['noochApp.services'])
  .service('statisticsService', function ($http, $localStorage) {
      
      this.GetMemberStats_Largest_sent_transfer = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken+'&query=Largest_sent_transfer');
      };

      this.GetMemberStats_totelSent = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_$_Sent');
      }; 


      this.GetMemberStats_Largest_received_transfer = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Largest_received_transfer');
      };

      this.GetMemberStats_Total_$_Received = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_$_Received');
      }; 

      this.GetMemberStats_Total_no_of_transfer_Received = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_no_of_transfer_Received');
      }; 

      this.GetMemberStats_Total_no_of_transfer_Sent = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_no_of_transfer_Sent');
      }; 

      this.GetMemberStats_Total_P2P_transfers = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_P2P_transfers');
      }; 

      this.GetMemberStats_Total_Friends_Invited = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_Friends_Invited');
      }; 

      this.GetMemberStats_Total_Friends_Joined = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_Friends_Joined');
      }; 

      this.GetMemberStats_Total_Posts_To_TW = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_Posts_To_TW');
      }; 

      this.GetMemberStats_Total_Posts_To_FB = function () {
          return $http.get(URLs.GetMemberStats + '?MemberId=' + $localStorage.GLOBAL_VARIABLES.MemberId + '&accessToken=' + $localStorage.GLOBAL_VARIABLES.AccessToken + '&query=Total_Posts_To_FB');
      };
  })
