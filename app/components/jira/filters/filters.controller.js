(function () {
    'use strict';

    angular
        .module('fp-filters')
        .controller('FiltersController', FiltersController);

    FiltersController.$inject = ['$scope', 'jira', 'settingsStorage'];

    function FiltersController($scope, jira, settingsStorage) {
        $scope.loading = true;

        $scope.setCurrentFilter = setCurrentFilter;

        jira.checkAuth()
            .catch(function () {
                return settingsStorage.loadSettings(['username', 'password'])
                    .then(function (settings) {
                        return jira.login(settings.username, settings.password)
                    });
            })
            .then(function () {
                return jira.getFavoriteFilters();
            })
            .then(function (filters) {
                $scope.filters = filters;
            })
            .catch(function (errorMsg) {
                $scope.error = errorMsg;
            })
            .finally(function () {
                $scope.loading = false;
            });

        //TODO filters and issues should be nested views of jira view
        function setCurrentFilter(jql) {
            jira.setCurrentFilterJQL(jql);
        }
    }
})();