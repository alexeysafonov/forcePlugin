forcePluginApp.controller('IssuesController', ['$scope', '$mdToast', 'jira',
    function ($scope, $mdToast, jira) {
        $scope.selectedIndex = null;
        $scope.loading = true;

        jira.getIssuesByCurrentFilter().success(function (data) {
            $scope.tickets = data.issues;

            $scope.tickets.forEach(function (issue) {
                jira.getPossibleActions(issue.key).success(function (data) {
                    issue.actions = data.transitions;
                });
            });
        }).finally(function () {
            $scope.loading = false;
        });

        $scope.select = function (index) {
            $scope.selectedIndex = index;
        };

        $scope.performAction = function (issueId, action) {
            jira.performAction(issueId, action.id).success(function () {
                $mdToast.show(
                    $mdToast.simple()
                        .content(action.to.name)
                        .position('left bottom')
                        .hideDelay(1000)
                );
            }).error(function () {
                $mdToast.show(
                    $mdToast.simple()
                        .content('unable to perform action')
                        .position('left bottom')
                        .hideDelay(1000)
                );
            });
        };
    }]);