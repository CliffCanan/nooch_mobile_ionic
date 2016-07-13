angular.module('noochApp.services', [])

     .service('authenticationService', function ($http) {
         var Operations = {};

         Operations.Login = function (username, password, remmberMe, callback) {
             $http.get(URLs.Login + '?userName=' + username + '&pwd=' + password + '&rememberMeEnabled=' + remmberMe + '&lat=0.0&lng=0.0&udid=11&devicetoken=111')
                   .success(function (response) {
                       callback(response);
                   });
         };


         Operations.FBLogin = function (email, firstName, lastName, gender, photoUrl, ip, fingerprint, fbUserId, callback) {
             var data = {};
             data.FirstName = firstName;
             data.LastName = lastName;
             data.eMail = email;
             data.Gender = gender;
             data.PhotoUrl = photoUrl;
             data.FacebookUserId = fbUserId;
             data.UserFingerPrints = fingerprint;
             data.Ip = ip;

             console.log(data);

             $http.post(URLs.LoginWithFB, data)
                 .success(function (response) {
                     callback(response);
                 });
         };


         Operations.GoogleLogin = function (email, name, photoUrl, ip, fingerprint, googleUserId, callback) {
             var data = {};
             data.Name = name;
             data.eMail = email;
             data.Gender = '';
             data.PhotoUrl = photoUrl;
             data.GoogleUserId = googleUserId;
             data.UserFingerPrints = fingerprint;
             data.Ip = ip;

             console.log(data);

             $http.post(URLs.LoginWithGoogle, data)
                 .success(function (response) {
                     callback(response);
                 });
         };


         return Operations;
     })


.factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++)
            {
                if (chats[i].id === parseInt(chatId))
                {
                    return chats[i];
                }
            }
            return null;
        }
    };
});
