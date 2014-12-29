forcePluginApp.factory('jira', ['$http',
    function ($http) {
        var currentFilterJQL = 'assignee = currentUser() AND resolution = Unresolved';

        return {
            setCurrentFilterJQL: function (jql) {
                currentFilterJQL = jql;
            },

            getCurrentFilterJQL: function () {
                return currentFilterJQL;
            },

            getFavoriteFilters: function () {
                return $http.get('https://jira.epam.com/jira/rest/api/2/filter/favourite?expand=false');
            },

            getIssuesByCurrentFilter: function () {
                return $http.post('https://jira.epam.com/jira/rest/api/2/search', {
                    "jql": currentFilterJQL,
                    "startAt": 0,
                    "maxResults": 15,
                    "fields": [
                        "summary",
                        "status",
                        "assignee",
                        "issuetype"
                    ]
                });
            }

        };
    }]);