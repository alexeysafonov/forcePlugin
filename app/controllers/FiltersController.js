
forcePluginApp.controller('FiltersController', ['$scope', 'jira',
    function ($scope, jira) {

        $scope.setCurrentFilter = function (jql) {
            jira.setCurrentFilterJQL(jql);
        };

        jira.getFavoriteFilters().success(function (data) {
            data.push({
                name: 'Assigned to me',
                jql: 'assignee = currentUser() AND resolution = Unresolved'
            });
            $scope.filters = data;
        });
    }]);