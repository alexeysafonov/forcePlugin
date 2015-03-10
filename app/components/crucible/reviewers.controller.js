(function () {
    "use strict";

    angular
        .module('forcePluginApp')
        .controller('ReviewersController', ReviewersController);

    ReviewersController.$inject = ['$scope', '$routeParams', '$mdToast', 'whoIsService', 'crucible'];

    function ReviewersController($scope, $routeParams, $mdToast, whoIsService, crucible) {
        var reviewKey = $routeParams.reviewKey;
        $scope.loading = this;

        whoIsService.findReviewers(reviewKey)
            .then(function (reviewers) {
                $scope.reviewers = reviewers.map(function (reviewerKey) {
                    return {
                        name: reviewerKey.replace('_', ' '),
                        key: reviewerKey
                    }
                });
            })
            .finally(function () {
                $scope.loading = false;
            });

        $scope.selectAll = function () {
            $scope.reviewers.forEach(function (reviewer) {
                reviewer.checked = true;
            });
        };

        $scope.addReviewers = function () {
            var reviewersToAddKeys = $scope.reviewers.reduce(function (arr, reviewer) {
                if (reviewer.checked) {
                    arr.push(reviewer.key);
                }
                return arr;
            }, []);

            crucible.addReviewers(reviewKey, reviewersToAddKeys)
                .then(function () {
                    $scope.reviewers = $scope.reviewers.reduce(function (arr, reviewer) {
                        if (reviewersToAddKeys.indexOf(reviewer.key) == -1) {
                            arr.push(reviewer);
                        }
                        return arr;
                    }, []);

                    $mdToast.show(
                        $mdToast.simple()
                            .content('Reviewers were added')
                            .position('left bottom')
                            .hideDelay(1000)
                    );
                });
        };
    }
})();