angular.module('noochApp.SelectRecipCtrl', ['ngCordova', 'noochApp.selectRecipientService', 'noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope, $rootScope, $state, $localStorage, $cordovaContacts, $ionicLoading, $filter,
                                         $ionicPlatform, $ionicActionSheet, $cordovaGoogleAnalytics, $timeout, $ionicHistory,
                                         CommonServices, selectRecipientService) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        $scope.loadComplete = false;
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


    //$scope.$on("$ionicView.afterEnter", function (event, data) {
    //    if ($ionicHistory.forwardView() != null && $ionicHistory.forwardView().title == 'How Much')
    //    {
    //        console.log("SELECT RECIP CNTRLR -> afterEnter -> RELOADING THE STATE")
    //        $ionicHistory.removeBackView();
    //        $state.reload();
    //    }
    //});


    $scope.FindRecent = function () {
        console.log('FindRecent Fired');

        $ionicLoading.show({
            template: 'Loading Recent Friends...'
        });

        $scope.currentView = 'recent';
        $scope.showEmPhDiv = false;

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
                                            console.log("Contacts use is authorized");
                                            $scope.fetchContacts();
                                        }
                                        else
                                            console.log("Contact permisison is " + status);
                                    }, function (error) {
                                        console.error(error);
                                    });
                                }
                            });
                        }
                    }, function (error) {
                        $scope.loadComplete = true;
                        console.error("isContactsAuthorized Error: [" + error + "]");
                    });
                }
                else // for Browser testing
                    $scope.loadComplete = true;
            })
            .error(function (error) {
                console.log(error);
                $ionicLoading.hide();
                $scope.loadComplete = true;

                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
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

        $scope.currentView = 'location';
        $scope.showEmPhDiv = false;

        $('#searchBar').val('');

        selectRecipientService.GetLocationSearch()
            .success(function (data) {
                console.log(data);

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

                $scope.memberList = data;

                $ionicLoading.hide();
            })
            .error(function (data) {
                console.log(data);
                $ionicLoading.hide();

                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
            });
    }


    $scope.checkSearchText = function () {

        console.log($('#searchBar').val().trim());
        var enteredText = $('#searchBar').val().trim();

        if (enteredText == '') $scope.showEmPhDiv = false;

        if ($('#recents-table').html() == undefined && enteredText.length > 2)
        {
            console.log($('#recents-table').html());
            // Check if the user has entered only numbers so far to see if it's a phone number or not
            if (isNaN(enteredText) && !($scope.sendTo == 'Contact Number' && enteredText.length > 5))
            {
                if (looksLikeEmail(enteredText))
                {
                    $scope.showEmPhDiv = true;
                    $scope.sendTo = 'Email Address';
                }
                else
                    $scope.showEmPhDiv = false;
            }
            else
            {
                console.log('contact');
                $scope.showEmPhDiv = true;
                $scope.sendTo = 'Contact Number';

                if (enteredText.length > 14) // Prevent additional chars since a full Phone # is already entered (10 digits + punctuation)
                    enteredText = enteredText.slice(0, -1);
                else if (enteredText.length > 7)
                    enteredText = enteredText.replace(/^\((\d{3})\)\s(\d{3})(\d{1})/, '($1) $2-$3'); //"(XXX) XXX-XXXX"
                else if (enteredText.length > 3)
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
                if (error.ExceptionMessage == 'Invalid OAuth 2 Access')
                    CommonServices.logOut();
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


    $scope.selectRecipListHeight = { 'max-height': $rootScope.screenHeight - 150 + 'px' }
})
