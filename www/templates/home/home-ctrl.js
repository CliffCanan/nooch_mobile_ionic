angular.module('noochApp.HomeCtrl', ['ngCordova', 'noochApp.services', 'noochApp.home-service'])


/****************/
/***   HOME   ***/
/****************/
.controller('HomeCtrl', function ($scope, $state, $cordovaGoogleAnalytics, $ionicPlatform, $timeout,
                                  $ionicLoading, $ionicContentBanner, $rootScope, $localStorage, $cordovaSocialSharing,
                                  authenticationService, profileService, selectRecipientService, CommonServices, $cordovaContacts) {

    $scope.$on("$ionicView.enter", function (event, data) {

        console.log('Home Ctrl Loaded');


        //$rootScope.UserIp = {
        //    Ip:null           
        //};
        $scope.deviceIp();


        if ($('#searchMoreFriends').hasClass('flipOutX'))
            $('#searchMoreFriends').removeClass('flipOutX');

        $scope.shouldDisplayErrorBanner = false;
        $scope.errorBannerTextArray = [];

        $timeout(function () {
            //console.log($localStorage.GLOBAL_VARIABLES);

            if ($rootScope.IsPhoneVerified == false)
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Phone Number Not Verified');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.isProfileComplete == false ||
                $rootScope.Status === "Registered")
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Profile Not Complete');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.Status === "Suspended" ||
                $rootScope.Status === "Temporarily_Blocked")
            {
                $scope.errorBannerTextArray.push('ACCOUNT SUSPENDED');
                $scope.shouldDisplayErrorBanner = true;
            }
            if ($rootScope.hasSynapseBank == false)
            {
                $scope.errorBannerTextArray.push('ACTION REQUIRED: Missing Bank Account');
                $scope.shouldDisplayErrorBanner = true;
            }

            if ($scope.shouldDisplayErrorBanner)
            {
                $ionicContentBanner.show({
                    text: $scope.errorBannerTextArray,
                    interval: '4000',
                    type: 'error',
                    transition: 'vertical'
                });

                $scope.isBannerShowing == true;
                $('#fav-container').css('margin-top', '40px');
            }
            else
                $scope.isBannerShowing == false;

            if ($localStorage.GLOBAL_VARIABLES.MemberId != null &&
                $localStorage.GLOBAL_VARIABLES.MemberId != '')
                $scope.FindRecentFriends();

        }, 1000);

        $ionicPlatform.ready(function () {
            // console.log($cordovaGoogleAnalytics);
            // $cordovaGoogleAnalytics.debugMode();
            // $cordovaGoogleAnalytics.startTrackerWithId('UA-XXXXXXXX-X');
            // $cordovaGoogleAnalytics.trackView('Home Screen');
        });
    });


    $scope.$on('foundPendingReq', function (event, args) {
        if ($scope.isBannerShowing == false)
        {
            $ionicContentBanner.show({
                text: ['Pending Request Waiting'],
                type: 'info',
                transition: 'vertical'
            });

            $scope.isBannerShowing = true;

            $('#fav-container').css('margin-top', '40px');
        }
    });


    $scope.memberList = [];
    $scope.phoneContacts = [];

    $scope.fetchContacts = function () {

        $ionicLoading.show({
            template: 'Loading...'
        });

        var options = {
            multiple: true
        };


        $scope.readContact = {
            FirstName: '',
            UserName: '',
            ContactNumber: '',
            Photo: '',
            id: '',
            bit: ''
        };
        console.log($cordovaContacts);
        $cordovaContacts.find(options).then(onSuccess, onError);

        function onSuccess(contacts) {
            console.log('phone' + contacts);
            for (var i = 0; i < contacts.length; i++)
            {
                var contact = contacts[i];
                if (contact.name.formatted != null && contact.emails != null)
                {
                    $scope.readContact.FirstName = contact.name.formatted;
                    $scope.readContact.id = i;
                    $scope.readContact.bit = 'p';
                    $scope.readContact.UserName = contact.emails[0].value;
                    if (contact.phoneNumbers != null)
                        $scope.readContact.ContactNumber = contact.phoneNumbers[0].value;
                    if (contact.photos != null)
                        $scope.readContact.Photo = contact.photos[0].value;

                    $scope.memberList.push($scope.readContact);

                    $scope.readContact = {
                        FirstName: '',
                        UserName: '',
                        ContactNumber: '',
                        Photo: '',
                        id: ''
                    };
                }
            }

            $scope.items = [];

            for (var i = 0; i <= 4; i++)
            {
                if (i < $scope.memberList.length)
                {
                    if ($scope.memberList[i].Photo == null || $scope.memberList[i].Photo == "")
                        $scope.memberList[i].Photo = "./img/profile_picture.png";

                    var tmp = [
                      { desc: $scope.memberList[i].FirstName, image: $scope.memberList[i].Photo }
                    ];

                    $scope.items = $scope.items.concat(tmp);
                }
            };

            // console.log($rootScope.phoneContacts);
            $ionicLoading.hide();
        };

        function onError(contactError) {
            console.log('errror');
            console.log(contactError);
            $ionicLoading.hide();
        };
    }

    $scope.FindRecentFriends = function () {
        //if ($cordovaNetwork.isOnline())
        //{
        $ionicLoading.show({
            template: 'Loading...'
        });

        selectRecipientService.GetRecentMembers().success(function (data) {

            $scope.memberList = data;
            console.log(data.length);
            if (data[0] == null || data.length < 5)
            {
                console.log('Got Recent Members Empty or less than 5, Loading phone contacts ..');


                cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
                    console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

                    if (authorized)
                    {
                        $scope.fetchContacts();
                    }
                    else
                    {
                        swal({
                            title: "Permissions not Granted!",
                            text: "Please click OK for allowing Nooch to read Contacts",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText: "Cancel",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Ok",
                            customClass: "stackedBtns"
                        }, function (isConfirm) {
                            if (isConfirm)
                            {
                                cordova.plugins.diagnostic.requestContactsAuthorization(function (status) {
                                    if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED)
                                    {
                                        console.log("Contacts use is authorized");
                                        $scope.fetchContacts();
                                    }
                                    else
                                    {
                                        console.log("Contact permisison is " + status);
                                    }
                                }, function (error) {
                                    console.error(error);
                                });
                            }
                        });
                    }
                }, function (error) {
                    console.error("isContactsAuthorized Error: [" + error + "]");
                });
            }

            console.log('GetRecentMembers()-->>');
            console.log($scope.memberList);

            $ionicLoading.hide();

        }).error(function (data) {
            console.log(data);
            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                CommonServices.logOut();
        })

        //.finally(function () {   will be used when ll be dealing with pull to refresh
        //    // Stop the ion-refresher from spinning
        //    $scope.$broadcast('scroll.refreshComplete');
        //});
        //}
        //else
        //    swal("Oops...", "Internet not connected!", "error");
    }


    $scope.goToSelectRecip = function () {
        if ($rootScope.Status == "Suspended" ||
            $rootScope.Status == "Temporarily_Blocked")
        {
            swal({
                title: "Account Suspended",
                text: "For security your account has been suspended pending a review." +
					  "<span class='show'>We really apologize for the inconvenience and ask for your patience. Our top priority is keeping Nooch safe and secure.</span>" +
					  "<span class='show'>Please contact us at support@nooch.com if this is a mistake or for more information.",
                type: "error",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Ok",
                cancelButtonText: "Contact Support",
                customClass: "smallText",
                html: true,
            }, function (isConfirm) {
                if (isConfirm)
                {
                    // toArr, ccArr and bccArr must be an array, file can be either null, string or array
                    //.shareViaEmail(message, subject, toArr, ccArr, bccArr, file) --Params
                    $cordovaSocialSharing
                      .shareViaEmail('', 'Nooch Support Request - Account Suspended', 'support@nooch.com', null, null, null)
                      .then(function (result) {
                          swal("Message Sent", "Your email has been sent - we will get back to you soon!", "success");
                      }, function (err) {
                          // An error occurred. Show a message to the user
                          console.log('Error attempting to send email from social sharing: [' + err + ']');
                      });
                }
            });
        }
        else if ($rootScope.Status == "Registered")
        {
            swal({
                title: "Please Verify Your Email",
                text: "Terribly sorry, but before you send money or add a bank account, please confirm your email address by clicking the link we sent to the email address you used to sign up.",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Ok"
            });
        }
        else if ($rootScope.IsPhoneVerified)
        {
            swal({
                title: "Blame The Lawyers",
                text: "To keep Nooch safe, we ask all users to verify a phone number before sending money." +
                      "<span class='show'>If you've already added your phone number, just respond 'Go' to the text message we sent.</span>",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Ok",
                html: true
            });
        }
        else if ($rootScope.isProfileComplete == false)
        {
            swal({
                title: "Help Us Keep Nooch Safe",
                text: "Please take 1 minute to verify your identity by completing your Nooch profile.",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Go Now",
                showCancelButton: true,
                cancelButtonText: "Later",
            }, function (isConfirm) {
                if (isConfirm)
                    $state.go('app.profile');
            });
        }
        else if ($localStorage.GLOBAL_VARIABLES.hasSynapseBank == false)
        {
            swal({
                title: "Connect A Funding Source",
                text: "Adding a bank account to fund Nooch payments is lightning quick:" +
					  "<ul><li>No routing or account number needed</li><li>Bank-grade encryption keeps your info safe</li>" +
					  "<span class='show'>Would you like to take care of this now?</span>",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Go Now",
                showCancelButton: true,
                cancelButtonText: "Later",
                html: true,
            }, function (isConfirm) {
                $state.go('app.settings');
            });
        }
        else if ($localStorage.GLOBAL_VARIABLES.hasSynapseBank == false)
        {
            swal({
                title: "Bank Account Un-Verified",
                text: "Looks like we need just a bit more info to verify your bank account. This usually happens when we were unable to match the contact info listed on the bank account with your Nooch profile information." +
					  "<span class='show'>Don't worry - we can solve this quickly. Please tap 'Learn More' for what to do next.</span>",
                type: "warning",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Go Now",
                showCancelButton: true,
                cancelButtonText: "Later",
                html: true,
            }, function (isConfirm) {
                $state.go('app.settings');
            });
        }
        else
        {
            $('#searchMoreFriends').addClass('flipOutX');
            $timeout(function () {
                $state.go('app.selectRecipient');
            }, 1000);
        }
    }

    $scope.deviceIp = function () {
        var json = 'http://ipv4.myexternalip.com/json';
        $http.get(json).then(function (result) {
            if ($rootScope.ip == null)
            {
                console.log('User Login/Signup at first time with Ip --' + result.data.ip);
                $rootScope.ip = result.data.ip;
                $scope.updateDeviceIp($rootScope.ip);
            }
            else if ($rootScope.ip != result.data.ip)
            {
                console.log('Ip Changed, new Ip is -' + result.data.ip);
                console.log('old Ip is  -' + $rootScope.ip);
                $rootScope.ip = result.data.ip;
                $scope.updateDeviceIp($rootScope.ip);
            }
            else
            {
                console.log('IP is not changed ' + $rootScope.ip);
            }
            console.log(result.data.ip)
        }, function (err) {
            console.log("error  " + err);
        });
    }

    $scope.updateDeviceIp = function (ip) {
        //if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Updating IP ...'
        });

        homeServices.UdateMemberIPAddress(ip)
          .success(function (data) {
              $scope.result = data;
              console.log($scope.result);
              $ionicLoading.hide();
          }).error(function (data) {
              console.log('eror' + data);
              $ionicLoading.hide();
              //  if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
              { CommonServices.logOut(); }
          });
        //  }
        //else {
        //    swal("Oops...", "Internet not connected!", "error");
        //}        
    }
})