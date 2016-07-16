angular.module('noochApp.howMuchCtrl', ['noochApp.services'])

.controller('howMuchCtrl', function ($scope, $state, $ionicPlatform, $ionicHistory) {

    $scope.$on("$ionicView.enter", function (event, data) {
        console.log('HowMuchCntrl Fired');

        $('#form').parsley();

        $(".amount-container input").focus();
    });

    $(".amount-container input").focusout(function () {
        if ($(".amount-container input").val().trim().length > 0)
        {
            if ($(this).parsley().validate() != true)
                $(this).focus();
            else
            {
                var enteredAmnt = $(".amount-container input").val().trim();
                if (enteredAmnt.indexOf(".") == -1)
                    $(".amount-container input").val(enteredAmnt + ".00");
                else if (enteredAmnt.indexOf(".") > enteredAmnt.length - 3)
                    $(".amount-container input").val(enteredAmnt + "0");
            }
        }
    });

    $scope.GoBack = function () {
        $state.go('app.selectRecipient');
    };

    $scope.submitRequest = function () {
        if ($('#howMuchForm').parsley().validate() == true)
        {
            $state.go('enterPin');
        }
    };

    $scope.addImage = function () {
        $ionicPlatform.ready(function () {
            window.imagePicker.getPictures(function (results) {
                for (var i = 0; i < results.length; i++)
                {
                    console.log('Image URI: ' + results[i]);
                }
            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: 1,
                width: 800
            }
            );
        });
    };
})
