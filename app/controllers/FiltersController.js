
forcePluginApp.controller('FiltersController', ['$scope', 'jira',
    function ($scope, jira) {

        $scope.setCurrentFilter = function (jql) {
            jira.setCurrentFilterJQL(jql);
        };

        jira.getFavoriteFilters().success(function (data) {
            $scope.filters = data;
        });
    }]);