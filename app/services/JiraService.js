forcePluginApp.service('jira', ['$http',
    function ($http) {
        var currentFilterJQL = 'assignee = currentUser() AND resolution = Unresolved';

        this.setCurrentFilterJQL = function (jql) {
            currentFilterJQL = jql;
        };

        this.getCurrentFilterJQL = function () {
            return currentFilterJQL;
        };

        this.getFavoriteFilters = function () {
            return $http.get('https://jira.epam.com/jira/rest/api/2/filter/favourite?expand=false');
        };

        this.getIssuesByCurrentFilter = function () {
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
    }]);