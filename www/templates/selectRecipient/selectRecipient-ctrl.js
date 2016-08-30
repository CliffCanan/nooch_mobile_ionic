angular.module('noochApp.SelectRecipCtrl', ['ngCordova', 'noochApp.selectRecipientService', 'noochApp.services'])

/************************/
/*** SELECT RECIPIENT ***/
/************************/
.controller('SelectRecipCtrl', function ($scope, $state, $localStorage, $cordovaContacts, selectRecipientService, $ionicLoading, $filter, $ionicPlatform, $rootScope, CommonServices) {

    $scope.$on("$ionicView.enter", function (event, data) {
      $scope.memberList = new Array();
        console.log('SelectRecipCtrl Fired');

        $scope.FindRecent();

        $scope.recentCount = null;



    });

    $scope.fetchContacts = function () {



                $ionicLoading.show({
                    template: 'Reading Contacts...'
                });

                var options = {
                  multiple : true
                };


                 $scope.readContact = {
                    FirstName: '',
                    UserName: '',
                    ContactNumber: '',
                    Photo: '',
                    id: '',
                    bit: ''
                };
                $cordovaContacts.find(options).then(onSuccess, onError);

                function onSuccess(contacts) {

                    for (var i = 0; i < contacts.length; i++) {
                        var contact = contacts[i];

                      $scope.readContact.FirstName = contact.name.formatted;
                      $scope.readContact.id = i;
                      $scope.readContact.bit = 'p';
                        if (contact.emails != null)
                          $scope.readContact.UserName = contact.emails[0].value;
                        if (contact.phoneNumbers != null)
                          $scope.readContact.ContactNumber = contact.phoneNumbers[0].value;
                        if (contact.photos != null)
                          $scope.readContact.Photo = contact.photos[0].value;
                        //$scope.phoneContacts.push(readContact);
                        $scope.memberList.push($scope.readContact);

                      $scope.readContact =
                        {
                            FirstName: '',
                            UserName: '',
                            ContactNumber: '',
                            Photo: '',
                            id: ''
                        };

                    }

                    // console.log($rootScope.phoneContacts);
                    $ionicLoading.hide();
                };

                function onError(contactError) {
                    // console.log(contactError);
                    $ionicLoading.hide();
                };



            //$ionicLoading.hide();


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


            // read contacts from device and push them in memberList object

            $scope.item2 = data;
            $ionicLoading.hide();


          cordova.plugins.diagnostic.isContactsAuthorized(function (authorized) {
            console.log("App is " + (authorized ? "authorized" : "denied") + " access to contacts");

            if (authorized) {

              $scope.fetchContacts();

            }
            else {

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
