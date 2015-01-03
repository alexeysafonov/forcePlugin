var forcePluginApp = angular.module('forcePluginApp', ['ngRoute', 'ngMaterial']);

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

//TODO find better way for toolbar links and 'back' button
forcePluginApp.run(
    function($rootScope, $location) {
    $rootScope.goTo = function(path) {
        $location.path(path);
    };

    $rootScope.back = function() {
        window.history.back();
    };
});
