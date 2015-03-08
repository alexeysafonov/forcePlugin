(function () {
    'use strict';

    angular
        .module('SettingsApp', [
            'ngMaterial',
            'fpSettingsMod'
        ])
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$mdToast', 'settingsStorage'];

    function SettingsController($scope, $mdToast, settingsStorage) {
        var settingSavedMsg = $mdToast.simple()
                .content('Settings were saved')
                .position('left top')
                .hideDelay(1000),
            errorMsg = $mdToast.simple()
                .content('Something went wrong')
                .position('left top')
                .hideDelay(1000);

        $scope.settings = {
            username: '',
            password: '',
            projectName: '',
            jiraUrl: '',
            crucibleUrl: ''
        };

        $scope.loading = true;
        settingsStorage.loadSettings(Object.keys($scope.settings)).then(function (data) {
            $scope.settings = data;
        }, function () {
            $mdToast.show(errorMsg);
        }).finally(function () {
            $scope.loading = false;
        });

        $scope.saveSettings = function () {
            $scope.loading = true;

            settingsStorage.saveSettings($scope.settings).then(function () {
                $mdToast.show(settingSavedMsg);
            }, function () {
                $mdToast.show(errorMsg);
            }).finally(function () {
                $scope.loading = false;
            });
        };
    }
})();