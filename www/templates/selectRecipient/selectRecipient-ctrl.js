angular.module('noochApp.SelectRecipCtrl', ['ngCordova', 'noochApp.selectRecipientService', 'noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope, $state, $localStorage, $cordovaContacts, selectRecipientService, $ionicLoading, $filter, $ionicPlatform, $rootScope, CommonServices) {
    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('SelectRecipCtrl Fired');

       

        $scope.FindRecent();

        $scope.recentCount = null;

        // to check contacts authorization
        console.log($localStorage.GLOBAL_VARIABLES.HasSharedContacts);
        if ($localStorage.GLOBAL_VARIABLES.HasSharedContacts == false) {
            cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
                console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

                if (authorized) {
                    console.log(authorized);
                    $scope.fetchContacts();
                    $localStorage.GLOBAL_VARIABLES.HasSharedContacts = true;
                }
                else {
                    console.log(authorized);
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
                        if (isConfirm) {

                            cordova.plugins.diagnostic.requestContactsAuthorization(function (status) {
                                if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
                                    console.log("Contacts use is authorized");

                                    $scope.fetchContacts();
                                    $localStorage.GLOBAL_VARIABLES.HasSharedContacts = true;
                                }
                                else {
                                    console.log("Contact permisison is " + status);

                                }
                            }, function (error) {
                                console.error(error);
                            });
                        }
                    });





                }

            }, function (error) {
                console.error("The following error occurred: " + error);
            });
        }
        else {

            $scope.fetchContacts();
        }

      //   to request contact authorization
         
       //  to check contacts authorization status
        // cordova.plugins.diagnostic.getContactsAuthorizationStatus(function(status){
        //   if(status === cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED){
        //     console.log("Contacts use never asked");
        
        //   }
        //   else{
        //     console.log("came in contacts status else part");
        //   }
        // }, function(onError){
        
        //   console.log("came in error outer "+onError);
        // });

        // cordova.plugins.diagnostic.getContactsAuthorizationStatus(function(status){

        //   // status === authorized    -- in case user has authorized  and by default it will same

        //   // status === denied   -- in case turned of contacts permission from settings in iphone
        //     console.log("Contact Authorization status is "+status);
        //   console.log("Contact Authorization status is "+ JSON.stringify( status));
        // }, function(onError){
        //   console.log("came in error outer "+onError);
        // });


        //cordova.plugins.diagnostic.requestContactsAuthorization(function(status){
        //  console.log("Contact Authorization status is "+status);
        //}, function(error){
        //  console.error(error);
        //});

        
    });

    $scope.fetchContacts = function () {

     
  
                $ionicLoading.show({
                    template: 'Loading Contacts...'
                });

                var options = {};
                options.multiple = true;

                var readContact = {
                    FirstName: '',
                    UserName: '',
                    ContactNumber: '',
                    Photo: '',
                    id: '',
                    bit: ''
                };
                $cordovaContacts.find(options).then(onSuccess, onError);

                function onSuccess(contacts) {

                    console.log(contacts);
                    for (var i = 0; i < contacts.length; i++) {
                        var contact = contacts[i];

                        readContact.FirstName = contact.name.formatted;
                        readContact.id = i;
                        readContact.bit = 'p';
                        if (contact.emails != null)
                            readContact.UserName = contact.emails[0].value;
                        if (contact.phoneNumbers != null)
                            readContact.ContactNumber = contact.phoneNumbers[0].value;
                        if (contact.photos != null)
                            readContact.Photo = contact.photos[0].value;
                        //$scope.phoneContacts.push(readContact);
                        $scope.memberList.push(readContact);
                        readContact =
                        {
                            FirstName: '',
                            UserName: '',
                            ContactNumber: '',
                            Photo: '',
                            id: ''
                        };

                    }

                    console.log($rootScope.phoneContacts);
                    $ionicLoading.hide();
                };

                function onError(contactError) {
                    console.log(contactError);
                    $ionicLoading.hide();
                };

            

            $ionicLoading.hide();
        

    }

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


    $scope.FindRecent = function () {
        console.log('FindRecent Fired');

        $ionicLoading.show({
            template: 'Loading Recent Friends...'
        });

        $scope.showSearchFlag = true;
        $scope.show = false;

        $('#searchBar').val('');

        selectRecipientService.GetRecentMembers().success(function (data) {

            $scope.memberList = data;

            $scope.recentCount = $scope.memberList.length;

            console.log('Recent List -->');
            console.log($scope.memberList);
            $ionicLoading.hide();
            //for (var i = 0; i < $rootScope.phoneContacts.length; i++)
            //{
            //    $scope.memberList.push($rootScope.phoneContacts[i]);
            //}

            // read contacts from device and push them in memberList object


            

            $scope.item2 = data;
            $ionicLoading.hide();

        }).error(function (data) {
            console.log(data);
            $ionicLoading.hide();

            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                CommonServices.logOut();
        });

    }


  

    $scope.$watch('search', function (val) {
        console.log($filter('filter')($scope.items2, val));

        $scope.memberList = $filter('filter')($scope.items2, val);

        console.log($scope.memberList);
    });

    $scope.GetLocationSearch = function () {

        $ionicLoading.show({
            template: 'Finding Nearby Users...'
        });

        $scope.showSearchFlag = false;
        $scope.show = false;
        $('#searchBar').val('');

        selectRecipientService.GetLocationSearch().success(function (data) {
            $scope.memberList = data;
            $ionicLoading.hide();
        }).error(function (data) {
            console.log(data);
            $ionicLoading.hide();

            if (data.ExceptionMessage == 'Invalid OAuth 2 Access')
                CommonServices.logOut();
        });
    }

    $scope.checkList = function () {
        if ($('#searchBar').val() == '')
        {
            $scope.show = false;
            $('#dvSendTo').style('display', 'none');
        }

        //console.log($('#recents-table').html());

        if ($('#recents-table').html() == undefined)
        {
            if (isNaN($('#searchBar').val()))
            {
                if (ValidateEmail($('#searchBar').val()))
                {
                    $scope.show = true;
                    $scope.sendTo = 'Email Address';
                }
            }
            else
            {
                $scope.show = true;
                $scope.sendTo = 'Contact Number';
            }
        }
        else
            $scope.show = false;
    }

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)*.+$/.test(mail))
            return (true)
        else
            return (false)
    }
})