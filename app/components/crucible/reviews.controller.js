(function () {
    "use strict";

    angular
        .module('forcePluginApp')
        .controller('ReviewsController', ReviewsController);

    ReviewsController.$inject = ['$scope', '$q', 'crucible', 'whoIsService', 'REVIEW_TYPE'];

    function ReviewsController($scope, $q, crucible, whoIs, REVIEW_TYPE) {
        $scope.loading = true;

        $scope.findReviewers = function (reviewKey) {
            whoIs.findReviewers(reviewKey)
                .then(function (reviewers) {
                    alert(reviewers.join(', '));
                });
        };

        var toReviewPromise = crucible.getReviews(REVIEW_TYPE.TO_REVIEW)
            .then(function (reviews) {
                $scope.reviewsToReview = reviews;
            });

        var outForReviewPromise = crucible.getReviews(REVIEW_TYPE.OUT_FOR_REVIEW)
            .then(function (reviews) {
                $scope.outForReview = reviews;
            });

        $q.all([toReviewPromise, outForReviewPromise])
            .then(function () {
                $scope.loading = false;
            });
    }
})();