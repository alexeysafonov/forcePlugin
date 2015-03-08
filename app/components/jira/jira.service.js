(function () {
    "use strict";

    angular
        .module('forcePluginApp')
        .service('jira', jiraService);

    jiraService.$inject = ['$http'];

    function jiraService($http) {
        var currentFilterJQL,
        //TODO move to settings
            host = 'https://jira.epam.com/jira';

        this.setCurrentFilterJQL = function (jql) {
            currentFilterJQL = jql;
        };

        this.getCurrentFilterJQL = function () {
            return currentFilterJQL;
        };

        this.login = function (login, password) {
            return $http.post(host + '/rest/auth/1/session', {
                username: login,
                password: password
            });
        };

        this.checkAuth = function () {
            return $http.get(host + '/rest/auth/1/session');
        };

        this.getFavoriteFilters = function () {
            return $http.get(host + '/rest/api/2/filter/favourite?expand=false');
        };

        this.getPossibleActions = function (issueId) {
            return $http.get(host + '/rest/api/2/issue/{issueId}/transitions'.replace('{issueId}', issueId));
        };

        this.performAction = function (issueId, actionId) {
            return $http.post(host + '/rest/api/2/issue/{issueId}/transitions'.replace('{issueId}', issueId), {
                'transition': actionId
            });
        };

        this.getIssuesByCurrentFilter = function () {
            return $http.post(host + '/rest/api/2/search', {
                "jql": currentFilterJQL,
                "startAt": 0,
                "maxResults": 15,
                "fields": [
                    'summary',
                    'status',
                    'assignee',
                    'issuetype'
                ]
            });
        }
    }
})();