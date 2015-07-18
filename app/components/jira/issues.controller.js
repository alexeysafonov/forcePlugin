(function () {
    'use strict';

    angular
        .module('forcePluginApp')
        .controller('IssuesController', IssuesController);

    IssuesController.$inject = ['$scope', '$mdToast', '$window', 'jira', 'crucible'];

    function IssuesController($scope, $mdToast, $window, jira, crucible) {
        $scope.selectedIndex = null;
        $scope.loading = true;
        $scope.select = function (index) {
            $scope.selectedIndex = index;
        };
        $scope.performAction = performAction;
        $scope.createReview = createReview;

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

        function performAction(issueId, action) {
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
        }

        function createReview(issue) {
            var name = `[${issue.key}] ${issue.fields.summary}`,
            //TODO find out how to get it from jira issue
                projectKey = 'CR-VTBRTLB';

            crucible.createReview(issue.fields.assignee.name, name, projectKey, issue.key)
                .then(function (review) {
                    $window.open(`https://crucible.epam.com/cru/${review.permaId.id}`);
                });
        }
    }
})();