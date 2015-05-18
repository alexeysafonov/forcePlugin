(function () {
    "use strict";

    angular
        .module('forcePluginApp')
        .controller('ReviewsController', ReviewsController);

    ReviewsController.$inject = ['$scope', '$q', 'crucible', 'REVIEW_TYPE'];

    function ReviewsController($scope, $q, crucible, REVIEW_TYPE) {
        $scope.loading = true;
        $scope.reviewsMap = {};

        $scope.reviewsNames = {};
        $scope.reviewsNames[REVIEW_TYPE.READY_TO_CLOSE] = 'Ready to close';
        $scope.reviewsNames[REVIEW_TYPE.OUT_FOR_REVIEW] = 'Out for review';
        $scope.reviewsNames[REVIEW_TYPE.TO_REVIEW] = 'To review';
        $scope.reviewsNames[REVIEW_TYPE.DRAFTS] = 'Drafts';

        var reviewTypesToLoad = [REVIEW_TYPE.READY_TO_CLOSE,
            REVIEW_TYPE.OUT_FOR_REVIEW,
            REVIEW_TYPE.TO_REVIEW,
            REVIEW_TYPE.DRAFTS];

        reviewTypesToLoad
            .reduce(function (promises, reviewType) {
                return promises.then(function () {
                    return crucible.getReviews(reviewType)
                        .then(function (reviews) {
                            $scope.reviewsMap[reviewType] = reviews;
                        });
                })

            }, $q.when(1))
            .then(function () {
                $scope.loading = false;
            });
    }
})();