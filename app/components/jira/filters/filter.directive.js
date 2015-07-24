(function () {
    'use strict';

    angular
        .module('fp-filters')
        .directive('fpFilter', fpFilter);

    fpFilter.$inject = ['jira'];

    function fpFilter(jira) {
        return {
            restrict: 'E',
            scope: {
                filter: '=ngModel'
            },
            templateUrl: 'app/components/jira/filters/filter.directive.html',
            controller: function ($scope) {
                $scope.edit = edit;
                $scope.cancelEdit = cancelEdit;
                $scope.save = save;

                function edit(filter) {
                    $scope.editing = true;
                }

                function cancelEdit(filter) {
                    $scope.editing = false;
                }

                function save(filter) {
                    $scope.saving = true;
                    jira.updateFilter(filter)
                        .then(function (updatedFilter) {
                            $scope.saving = false;
                            cancelEdit(filter);
                        });

                }
            }
        }
    }
})();