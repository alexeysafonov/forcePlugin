(function () {
    'use strict';

    angular
        .module('fp-filters')
        .controller('FiltersController', FiltersController);

    FiltersController.$inject = ['$scope', 'jira'];

    function FiltersController($scope, jira) {
        $scope.loading = true;

        $scope.setCurrentFilter = setCurrentFilter;

        jira.getFavoriteFilters()
            .then(function (filters) {
                filters.push({
                    name: 'Assigned to me',
                    jql: 'assignee = currentUser() AND resolution = Unresolved'
                });
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