angular.module('noochApp.SelectRecipCtrl', ['ngCordova', 'noochApp.selectRecipientService', 'noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope, $rootScope, $state, $localStorage, $cordovaContacts, $ionicLoading, $filter,
                                         $ionicPlatform, $cordovaGeolocation, $ionicActionSheet, $cordovaGoogleAnalytics, $timeout,
                                         $ionicHistory, CommonServices, selectRecipientService) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        $scope.loadComplete = false;
        $scope.selectRecipListHeight = { 'height': $rootScope.screenHeight - 155 + 'px' }
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('SelectRecipCtrl Fired');

        if (typeof $scope.memberList == 'undefined')
            $scope.memberList = new Array();
        else
            console.log($scope.memberList.length);

        $scope.FindRecent();

        $scope.currentView = 'recent';
        $scope.sendTo = '';

        if (typeof $scope.recentCount == 'undefined')
            $scope.recentCount = 0;

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Select Recipient");
        })
    });


    $scope.FindRecent = function () {
        console.log('FindRecent Fired');

        $ionicLoading.show({
            template: 'Loading Recent Friends...'
        });

        $scope.loadComplete = false;
        $scope.currentView = 'recent';
        $scope.showEmPhDiv = false;
        $scope.selectRecipListHeight = { 'height': $rootScope.screenHeight - 155 + 'px' }

        $('#searchBar').val('');

        selectRecipientService.GetRecentMembers()
            .success(function (data) {

                $scope.memberList = data;
                $scope.recentCount = $scope.memberList.length;
                $scope.item2 = data;

                $ionicLoading.hide();

                if (window.cordova)
                {
                    cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
                        console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

                        if (authorized)
                        {
                            // Read contacts from device and push them into memberList {} object
                            $scope.fetchContacts();
                        }
                        else
                        {
                            swal({
                                title: "Use Address Book?",
                                text: "Sending money to friends is simple when you have them in your phone's address book." +
                                      "Otherwise you'll have to manually type their email address or phone number.",
                                type: "info",
                                showCancelButton: true,
                                cancelButtonText: "Not Now",
                                confirmButtonColor: "#3fabe1",
                                confirmButtonText: "Authorize"
                            }, function (isConfirm) {
                                if (isConfirm)
                                {
                                    cordova.plugins.diagnostic.requestContactsAuthorization(function (status) {
                                        if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED)
                                        {
                                            //console.log("Contacts use is authorized");
                                            $scope.fetchContacts();
                                        }
                                        //else
                                        //    console.log("Contact permisison is " + status);
                                    }, function (error) {
                                        console.error(error);
                                        CommonServices.DisplayError('Unable to access phone contacts :-(');
                                    });
                                }
                            });
                        }
                    }, function (error) {
                        $scope.loadComplete = true;
                        console.error("isContactsAuthorized Error: [" + error + "]");
                        CommonServices.DisplayError('Unable to access phone contacts :-(');
                    });
                }
                else // for Browser testing
                    $scope.loadComplete = true;
            })
            .error(function (error) {
                console.log(error);
                $scope.loadComplete = true;
                $ionicLoading.hide();

                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
                else if (error != null)
                    CommonServices.DisplayError('Unable to access phone contacts :-(');
            });
    }


    $scope.fetchContacts = function () {

        var options = {
            multiple: true
        };

        $scope.readContact = {
            FirstName: '',
            UserName: '',
            ContactNumber: '',
            Photo: '././img/profile_picture.png',
            id: '',
            bit: '',
            otherEmails: [],
            otherPhoneNumbers: []
        };

        $cordovaContacts.find(options).then(onSuccess, onError);

        function onSuccess(contacts) {
            console.log(contacts.length);
            console.log($rootScope.selectRecipContactLength);

            if (contacts.length != $rootScope.selectRecipContactLength)
            {
                $rootScope.selectRecipContactLength = contacts.length;
                for (var i = 0; i < contacts.length; i++)
                {
                    var contact = contacts[i];

                    if (contact.name.formatted != null && contact.emails != null)
                    {
                        $scope.readContact.FirstName = contact.name.formatted;
                        $scope.readContact.id = i;
                        $scope.readContact.bit = 'p';

                        $scope.readContact.UserName = contact.emails[0].value;

                        if (contact.emails.length > 1)
                        {
                            for (var n = 1; n < contact.emails.length; n++) // start at 2nd, we already have the 1st
                            {
                                if (CommonServices.ValidateEmail(contact.emails[n].value))
                                    $scope.readContact.otherEmails.push({ 'value': contact.emails[n].value }, { 'type': contact.emails[n].type })
                            }
                        }

                        if (contact.phoneNumbers != null)
                        {
                            $scope.readContact.ContactNumber = contact.phoneNumbers[0].value;
                            $scope.readContact.otherPhoneNumbers = contact.phoneNumbers;
                        }

                        if (contact.photos != null)
                            $scope.readContact.Photo = contact.photos[0].value;

                        $scope.memberList.push($scope.readContact);
                        $rootScope.contacts.push($scope.readContact);

                        $scope.readContact = {
                            FirstName: '',
                            UserName: '',
                            ContactNumber: '',
                            Photo: '././img/profile_picture.png',
                            id: '',
                            bit: '',
                            otherEmails: [],
                            otherPhoneNumbers: []
                        };
                    }
                }
            }
            else
            {
                console.log($scope.memberList);
                $scope.memberList.push.apply($scope.memberList, $rootScope.contacts);
                console.log($scope.memberList);
            }

            $scope.loadComplete = true;
            $ionicLoading.hide();
        };

        function onError(error) {
            console.log(error);
            $scope.loadComplete = true;
            $ionicLoading.hide();
        };
    }


    $scope.openFilterChoices = function (member) {

        console.log(member);
        $scope.buttonValues = {
            id: '',
            text: ''
        }

        if (member.otherEmails == null || member.otherEmails.length < 2 || member.otherEmails == 'undefined')
        {
            $state.go('app.howMuch', { recip: member });
        }
        else
        {
            var buttons = [];
            for (var i = 0; i < member.otherEmails.length; i++)
            {
                if (i < 4)
                {
                    if (CommonServices.ValidateEmail(member.otherEmails[i].value))
                    {
                        $scope.buttonValues.id = i;
                        $scope.buttonValues.text = member.otherEmails[i].value;
                        buttons.push($scope.buttonValues);

                        $scope.buttonValues = {
                            id: '',
                            text: ''
                        }
                    }
                }
            }

            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: "Which Email Address?",
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    member.UserName = member.otherEmails[index].value;
                    $state.go('app.howMuch', { recip: member });
                    return true;
                }
            });
        }
    };


    $scope.GoBack = function () {
        $state.go('home');
    };


    $scope.go = function (data) {
        if (data == 'howMuch') $state.go('howMuch');
    }


    $scope.$watch('search', function (val) {
        //console.log($filter('filter')($scope.items2, val));

        $scope.memberList = $filter('filter')($scope.items2, val);

        //console.log($scope.memberList);
    });


    $scope.GetLocationSearch = function () {

        $ionicLoading.show({
            template: 'Finding Nearby Users...'
        });

        $scope.loadComplete = false;
        $scope.currentView = 'location';
        $scope.showEmPhDiv = false;

        $scope.selectRecipListHeight = { 'height': $rootScope.screenHeight - 115 + 'px' }

        $('#searchBar').val('');

        $scope.getCurrentLocation();
    }


    $scope.getCurrentLocation = function () {
        console.log('getCurrentLocation Fired');

        $ionicPlatform.ready(function () {
            if (window.cordova)
            {
                cordova.plugins.diagnostic.isLocationEnabled(function (authorized) {
                    if (authorized == true)
                    {
                        console.log('Location Authorized - CALLING GET LOACTION');

                        $cordovaGeolocation
                            .getCurrentPosition()
                            .then(function (position) {
                                var lat = position.coords.latitude
                                var long = position.coords.longitude

                                $localStorage.GLOBAL_VARIABLES.UserCurrentLongi = long;
                                $localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = lat;

                                console.log('$cordovaGeolocation success -> Lat/Long: [' + lat + ', ' + long + ']');

                                $scope.getNearbyUsers();
                            }, function (err) {
                                console.log('$cordovaGeolocation error: [' + JSON.stringify(err) + ']');
                                CommonServices.DisplayError('Unable to get current location');
                                $scope.getNearbyUsers();
                            });
                    }
                    else
                    {
                        // User has not yet authorized location access

                        // CC (9/16/16): IS THIS WHEN THE USER HAS *DENIED* LOCATION?  OR THAT THE DEVICE'S GPS IS NOT TURNED ON?
                        $localStorage.GLOBAL_VARIABLES.IsUserLocationSharedWithNooch = false;
                        //$localStorage.GLOBAL_VARIABLES.UserCurrentLongi = '0.00';
                        //$localStorage.GLOBAL_VARIABLES.UserCurrentLatitude = '0.00';

                        $scope.getNearbyUsers();

                        /*swal({
                            title: "GPS Off",
                            text: "Your Location is not shared with Nooch Would you like to share it",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, Enable",
                        }, function () {
                            if (window.cordova) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                                $timeout($scope.getLocation, 4000); //calling this service after 4s b/c user will take some time to on the GPS :Surya
                            }
                        });*/
                    }
                }, function (error) {
                    console.log("isLocationEnabled Error: [" + JSON.stringify(error) + ']');
                });
            }
            else // For Browser Testing
            {
                console.log('getCurrentLocation --> Browser testing - going to getNearbyUsers()');
                $scope.getNearbyUsers();
            }
        });
    }


    $scope.getNearbyUsers = function () {
        selectRecipientService.GetLocationSearch()
            .success(function (data) {
                console.log(data);

                if (data != null && data.length > 0)
                {
                    for (var i = 0; i < data.length; i++)
                    {
                        if (data[i].Miles < 1)
                        {
                            data[i].Miles = data[i].Miles * 5280;
                            data[i].Miles = data[i].Miles + ' Feet';
                        }
                        else
                        {
                            data[i].Miles = data[i].Miles + ' Miles';
                        }
                    }

                    //console.log("Found Nearby Users!");
                    $scope.memberList = data;
                    $scope.foundNearbyUsers = true;
                }
                else
                {
                    //console.log("No Nearby Users!");
                    $scope.memberList = [];
                    $scope.foundNearbyUsers = false;
                }

                $scope.loadComplete = true;
                $ionicLoading.hide();
            })
            .error(function (error) {
                console.log(error);

                $scope.loadComplete = true;
                $ionicLoading.hide();

                if (error != null && error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
                else if (error != null)
                    CommonServices.DisplayError('Unable to find nearby users :-(');
            });
    }


    $scope.checkSearchText = function () {

        var enteredText = $('#searchBar').val().trim();
        //console.log(enteredText);


        if ($('#recents-table').html() == undefined && enteredText.length > 3)
        {
            // Check if the user has entered only numbers so far to see if it's a phone number or not

            var stringToCheck = enteredText.replace(/[()-\s]/g, '');

            //console.log(stringToCheck);

            if (isNaN(stringToCheck) && enteredText.length > 5)
            {
                if (looksLikeEmail(enteredText))
                {
                    $scope.showEmPhDiv = true;
                    $scope.sendTo = 'Email Address';
                }
                else
                    $scope.showEmPhDiv = false;
            }
            else if (!isNaN(stringToCheck))
            {
                $scope.showEmPhDiv = true;
                $scope.sendTo = 'Contact Number';

                if (enteredText.length > 14) // Prevent additional chars since a full Phone # is already entered (10 digits + punctuation)
                    enteredText = enteredText.slice(0, -1);
                else if (enteredText.length > 7)
                    enteredText = enteredText.replace(/^\((\d{3})\)\s(\d{3})(\d{1})/, '($1) $2-$3'); //"(XXX) XXX-XXXX"
                else if (enteredText.length < $scope.nonUserText.length) // Last key entered was 'Delete', so user may not be entering a phone # anymore, so remove punctuation
                    enteredText = stringToCheck;
                else if (enteredText.length > 5)
                    enteredText = enteredText.replace(/^\(?(\d{3})(\d{1})/, '($1) $2'); //"(XXX) X"

                $('#searchBar').val(enteredText);
            }

            $scope.nonUserText = enteredText;
        }
        else
        {
            $scope.showEmPhDiv = false;
            $scope.nonUserText = '';
        }
    }


    $scope.checkSearchTextForHowMuch = function () {
        console.log('checkSearchTextForHowMuch FIRED');

        //check if phone or email is already registered with nooch i.e existing user

        var loadingText = "Checking that ";
        var StringToCheck = $scope.nonUserText;
        var type = "";

        if ($scope.sendTo == 'Contact Number')
        {
            // Stip out non-digits if it's a Phone Number
            StringToCheck = StringToCheck.replace(/\D/g, '');

            if (StringToCheck.length != 10)
            {
                swal({
                    title: "Almost There...",
                    text: "Please make sure you entered a valid 10-digit phone number!",
                    type: "warning",
                    confirmButtonColor: "#3fabe1",
                    customClass: "heavierText"
                }, function () {
                    $timeout(function () {
                        $("#searchBar").focus();
                    }, 800);
                });

                return;
            }

            type = "phone"
            loadingText += "phone number...";
        }
        else
        {
            if (!CommonServices.ValidateEmail(StringToCheck))
            {
                swal({
                    title: "Almost There...",
                    text: "Please make sure you entered a valid email address!",
                    type: "warning",
                    confirmButtonColor: "#3fabe1",
                    customClass: "heavierText"
                }, function () {
                    $timeout(function () {
                        $("#searchBar").focus();
                    }, 800);
                });

                return;
            }

            type = "email"
            loadingText += "email...";
        }

        $ionicLoading.show({
            template: loadingText
        });

        selectRecipientService.CheckMemberExistenceUsingEmailOrPhone(type, StringToCheck)
            .success(function (data) {
                $ionicLoading.hide();

                if (data.IsMemberFound == true)
                {
                    // User found
                    var existingUser = {
                        FirstName: data.Name,
                        //LastName: "",
                        MemberId: data.MemberId,
                        Photo: data.UserImage
                    }

                    $state.go('app.howMuch', { recip: existingUser });
                }
                else
                {
                    // User not found
                    var nonNoochUser = {
                        type: $scope.sendTo == 'Contact Number' ? "phone" : "email",
                        value: $scope.nonUserText,
                    }

                    $state.go('app.howMuch', { recip: nonNoochUser });
                }
            })
            .error(function (error) {
                $ionicLoading.hide();
                if (error != null && error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
                else if (error != null)
                    CommonServices.DisplayError('Unable to complete your request :-(');
            });
    }


    function looksLikeEmail(text) {
        // For checking the search field on keyup to see if the entered text looks like an email.
        // NOTE: Only checks for "@" plus one char, so it's not guaranteeing a completely valid email.
        var regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*.?/);
        if (regex.test(text))
            return true;
        else
            return false;
    }

})
