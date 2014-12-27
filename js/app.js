var forcePluginApp = angular.module('forcePluginApp', ['ngRoute']);

forcePluginApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/jira/filters', {
                templateUrl: 'views/jira-filters.html',
                controller: 'FiltersController'
            }).
            when('/jira/issues', {
                templateUrl: 'views/jira-issues.html',
                controller: 'IssuesController'
            }).
            when('/crucible/reviews', {
                templateUrl: 'views/crucible-reviews.html',
                controller: 'ReviewsController'
            }).
            otherwise({
                redirectTo: '/jira/filters'
            });
    }]);

forcePluginApp.controller('FiltersController', function ($scope, $http) {
    $http.get('https://jira.epam.com/jira/rest/api/2/filter/favourite?expand=false')
        .success(function (data) {
            $scope.filters = data;
        });
});

forcePluginApp.controller('IssuesController', function ($scope, $http) {
    $http({
        method: 'POST',
        url: 'https://jira.epam.com/jira/rest/api/2/search',
        data: {
            "jql": 'assignee = currentUser() AND resolution = Unresolved',
            "startAt": 0,
            "maxResults": 15,
            "fields": [
                "summary",
                "status",
                "assignee",
                "issuetype"
            ]
        }
    }).success(function (data) {
        $scope.tickets = data.issues;
    });
});

forcePluginApp.controller('ReviewsController', function ($scope) {
    $scope.reviews = [{
        name: "[VTBRTBR-8246] Review 1"
    }, {
        name: "[VTBRTBR-8242] Review 2"
    }, {
        name: "[VTBRTBR-8258] Review 3"
    }, {
        name: "[VTBRTBR-8317] Review 4"
    }]
});