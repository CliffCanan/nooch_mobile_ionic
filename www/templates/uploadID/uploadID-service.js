angular.module('noochApp.uploadID-service', ['noochApp.services'])
  .service('uploadIDService', function ($http, $localStorage) {

      this.submitDocumentToSynapseV3 = function (picture) {

          var reqForsubmitDocumentToSynapseV3 = {
              method: 'POST',
              url: URLs.submitDocumentToSynapseV3,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: {
                  Picture: picture,
                  MemberId: $localStorage.GLOBAL_VARIABLES.MemberId,
                  AccessToken: $localStorage.GLOBAL_VARIABLES.AccessToken,
              }
          };
          return $http(reqForsubmitDocumentToSynapseV3);
      }

  })