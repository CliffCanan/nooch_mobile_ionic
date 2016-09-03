angular.module('noochApp.home-service', ['noochApp.services'])
  .service('homeServices', function ($http, $localStorage) {


      this.UdateMemberIPAddress = function (Ip) {


          var reqForUdateMemberIPAddress = {
              method: 'POST',
              url: URLs.UdateMemberIPAddress ,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  AccessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
                  IpAddress: Ip,
                  DeviceId: $localStorage.GLOBAL_VARIABLES.DeviceId
              }
          };

          return $http(reqForUdateMemberIPAddress);
      }
    
  })
