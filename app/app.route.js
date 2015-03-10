(function () {
    'use strict';

    angular
        .module('forcePluginApp')
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];

    function routeConfig($routeProvider) {
        $routeProvider.
            when('/jira/filters', {
                templateUrl: 'app/components/jira/filters.html',
                controller: 'FiltersController'
            }).
            when('/jira/issues', {
                templateUrl: 'app/components/jira/issues.html',
                controller: 'IssuesController'
            }).
            when('/crucible/reviews', {
                templateUrl: 'app/components/crucible/reviews.html',
                controller: 'ReviewsController'
            }).
            when('/crucible/reviewers/:reviewKey', {
                templateUrl: 'app/components/crucible/reviewers.html',
                controller: 'ReviewersController'
            }).
            otherwise({
                redirectTo: '/jira/filters'
            });
    }
})();