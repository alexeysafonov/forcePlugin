(function () {
    'use strict';

    angular
        .module('forcePluginApp')
        .controller('FiltersController', FiltersController);

    FiltersController.$inject = ['$scope', 'jira'];

    function FiltersController($scope, jira) {
        $scope.loading = true;

        $scope.setCurrentFilter = function (jql) {
            jira.setCurrentFilterJQL(jql);
        };

        jira.getFavoriteFilters().success(function (data) {
            data.push({
                name: 'Assigned to me',
                jql: 'assignee = currentUser() AND resolution = Unresolved'
            });
            $scope.filters = data;
        }).finally(function () {
            $scope.loading = false;
        });
    }
})();