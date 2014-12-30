forcePluginApp.controller('IssuesController', ['$scope', 'jira',
    function ($scope, jira) {
        $scope.loading = true;

        jira.getIssuesByCurrentFilter().success(function (data) {
            $scope.tickets = data.issues;
        }).finally(function () {
            $scope.loading = false;
        });
    }]);