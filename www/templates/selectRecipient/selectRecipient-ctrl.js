angular.module('noochApp.SelectRecipCtrl', ['ngCordova', 'noochApp.selectRecipientService', 'noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope, $state, $localStorage, $cordovaContacts, selectRecipientService, $ionicLoading, $filter, $ionicPlatform, $rootScope, CommonServices, $ionicActionSheet, $cordovaGoogleAnalytics) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        $scope.loadComplete = false;
    });


    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('SelectRecipCtrl Fired');

        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') analytics.trackView("Select Recipient");
        })

        $scope.memberList = new Array();

        $scope.FindRecent();

        $scope.recentCount = null;
    });


    $scope.FindRecent = function () {
        console.log('FindRecent Fired');

        $ionicLoading.show({
            template: 'Loading Recent Friends...'
        });

        $scope.showSearchFlag = true;
        $scope.showEmPhDiv = false;

        $('#searchBar').val('');

        selectRecipientService.GetRecentMembers()
            .success(function (data) {

                $scope.memberList = data;

                $scope.recentCount = $scope.memberList.length;

                // read contacts from device and push them in memberList object

                $scope.item2 = data;
                $ionicLoading.hide();

                if (window.cordova)
                {
                    cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
                        console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

                        if (authorized)
                        {
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
                                confirmButtonText: "Authorize",
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
            .error(function (data) {
                console.log(data);
                $ionicLoading.hide();
                $scope.loadComplete = true;

                if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
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
            console.log($localStorage.GLOBAL_VARIABLES.contactsLength);

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
                                if (ValidateEmail(contact.emails[n].value))
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

                $scope.loadComplete = true;
                $ionicLoading.hide();
            }
            else
            {
                console.log($scope.memberList);
                $scope.memberList.push.apply($scope.memberList, $rootScope.contacts);
                console.log($scope.memberList);
            }
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
                    if (ValidateEmail(member.otherEmails[i].value))
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


    $scope.showSearch = function (member) {
        console.log($scope.search);
        if (member.FirstName == $scope.search ||
            member.LastName == $scope.search ||
            member.UserName == $scope.search)
        {
            return member
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

        console.log($scope.memberList);
    });


    $scope.GetLocationSearch = function () {

        $ionicLoading.show({
            template: 'Finding Nearby Users...'
        });

        $scope.showSearchFlag = false;
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


    $scope.checkList = function () {

        if ($('#searchBar').val() == '')
            $scope.showEmPhDiv = false;

        if ($('#recents-table').html() == undefined)
        {
            if (isNaN($('#searchBar').val()))
            {
                if (ValidateEmail($('#searchBar').val()))
                {
                    console.log('true email');
                    $scope.showEmPhDiv = true;
                    $scope.sendTo = 'Email Address';
                }
            }
            else
            {
                console.log('true contact');
                $scope.showEmPhDiv = true;
                $scope.sendTo = 'Contact Number';
            }
        }
        else
            $scope.showEmPhDiv = false;
    }


    function ValidateEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)*.+$/.test(email))
            return (true)
        else
            return (false)
    }

    $scope.selectRecipListHeight = { 'max-height': $rootScope.screenHeight - 150 + 'px' }
})
