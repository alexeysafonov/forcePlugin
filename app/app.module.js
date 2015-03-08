(function () {
    'use strict';

    angular
        .module('forcePluginApp', [
            'ngRoute',
            'ngMaterial',
            'fpSettingsMod'
        ])
        .run(config);

    config.$inject = ['$rootScope', '$location'];

    function config($rootScope, $location) {
        $rootScope.goTo = function (path) {
            $location.path(path);
        };

        $rootScope.back = function () {
            window.history.back();
        };
    }
})();