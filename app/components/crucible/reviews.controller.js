(function () {
    "use strict";

    angular
        .module('forcePluginApp')
        .controller('ReviewsController', ReviewsController);

    ReviewsController.$inject = ['$scope', 'crucible', 'whoIsService', 'REVIEW_TYPE'];

    function ReviewsController($scope, crucible, whoIs, REVIEW_TYPE) {

        $scope.findReviewers = function (reviewKey) {
            whoIs.findReviewers(reviewKey)
                .then(function (reviewers) {
                    alert(reviewers);
                });
        };

        crucible.getReviews(REVIEW_TYPE.TO_REVIEW)
            .then(function (reviews) {
                $scope.reviewsToReview = reviews;
            });

        crucible.getReviews(REVIEW_TYPE.OPEN)
            .then(function (reviews) {
                $scope.openReviews = reviews;
            });

    }
})();