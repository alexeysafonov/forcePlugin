(function () {
    'use strict';

    angular
        .module('fp-jira', [])
        .service('jira', jiraService);

    jiraService.$inject = ['$http', '$q', '$log'];

    function jiraService($http, $q, $log) {
        var currentFilterJQL,
        //TODO move to settings
            host = 'https://jira.epam.com/jira';

        return {
            setCurrentFilterJQL: setCurrentFilterJQL,
            getCurrentFilterJQL: getCurrentFilterJQL,
            login: login,
            checkAuth: checkAuth,
            getFavoriteFilters: getFavoriteFilters,
            getPossibleActions: getPossibleActions,
            performAction: performAction,
            getIssuesByCurrentFilter: getIssuesByCurrentFilter,
            updateFilter: updateFilter
        };

        function setCurrentFilterJQL(jql) {
            currentFilterJQL = jql;
        }

        function getCurrentFilterJQL() {
            return currentFilterJQL;
        }

        function login(login, password) {
            return $http.post(`${host}/rest/auth/1/session`, {
                username: login,
                password: password
            });
        }

        function checkAuth() {
            return $http.get(`${host}/rest/auth/1/session`);
        }

        function getFavoriteFilters() {
            return $http.get(`${host}/rest/api/2/filter/favourite?expand=false`)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.warn(`Jira failed in ${getFavoriteFilters.name}: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.text);
                });
        }

        function getPossibleActions(issueId) {
            return $http.get(`${host}/rest/api/2/issue/${issueId}/transitions`);
        }

        function performAction(issueId, actionId) {
            return $http.post(`${host}/rest/api/2/issue/${issueId}/transitions`, {
                'transition': actionId
            });
        }

        function getIssuesByCurrentFilter() {
            return $http.post(`${host}/rest/api/2/search`, {
                "jql": currentFilterJQL,
                "startAt": 0,
                "fields": [
                    'summary',
                    'status',
                    'assignee',
                    'issuetype',
                    'project'
                ]
            })
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.warn(`Jira failed on getting issues by filter: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.text);
                });
        }

        function updateFilter(filter) {
            return $http.put(`${host}/rest/api/2/filter/${filter.id}?expand=false`, filter)
                .then(function (updatedFilter) {
                    return updatedFilter;
                })
                .catch(function (response) {
                    $log.warn(`Jira failed on filter update: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.text);
                });
        }
    }
})();