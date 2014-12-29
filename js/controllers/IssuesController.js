
forcePluginApp.controller('IssuesController', ['$scope', 'jira',
    function ($scope, jira) {
        jira.getIssuesByCurrentFilter().
            success(function (data) {
                $scope.tickets = data.issues;
            });
    }]);