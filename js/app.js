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