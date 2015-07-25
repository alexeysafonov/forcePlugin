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

        function login(username, password) {
            return $http.post(`${host}/rest/auth/1/session`, {
                username: username,
                password: password
            })
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    _logError(login, response);
                    return $q.reject(response.data.errorMessages[0]);
                });
        }

        function checkAuth() {
            return $http.get(`${host}/rest/auth/1/session`)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    _logError(checkAuth, response);
                    return $q.reject(response.data.errorMessages[0]);
                });

        }

        function getFavoriteFilters() {
            return $http.get(`${host}/rest/api/2/filter/favourite?expand=false`)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    _logError(getFavoriteFilters, response);
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
                    _logError(getIssuesByCurrentFilter, response);
                    return $q.reject(response.text);
                });
        }

        function updateFilter(filter) {
            return $http.put(`${host}/rest/api/2/filter/${filter.id}?expand=false`, filter)
                .then(function (updatedFilter) {
                    return updatedFilter;
                })
                .catch(function (response) {
                    _logError(updateFilter, response);
                    return $q.reject(response.text);
                });
        }

        function _logError(method, response) {
            $log.warn(`Jira failed in ${method.name}(): ${response.statusText} - ${response.status}`);
        }
    }
})();