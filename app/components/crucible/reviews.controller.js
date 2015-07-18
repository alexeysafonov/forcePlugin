(function () {
    'use strict';

    angular
        .module('forcePluginApp')
        .controller('ReviewsController', ReviewsController);

    ReviewsController.$inject = ['$scope', '$q', '$mdToast', 'crucible', 'REVIEW_TYPE', 'REVIEW_ACTION'];

    function ReviewsController($scope, $q, $mdToast, crucible, REVIEW_TYPE, REVIEW_ACTION) {
        // data
        $scope.loading = true;
        $scope.reviewsMap = {};
        $scope.selectedReview = null;

        $scope.reviewsNames = {};
        $scope.reviewsNames[REVIEW_TYPE.READY_TO_CLOSE] = 'Ready to close';
        $scope.reviewsNames[REVIEW_TYPE.OUT_FOR_REVIEW] = 'Out for review';
        $scope.reviewsNames[REVIEW_TYPE.TO_REVIEW] = 'To review';
        $scope.reviewsNames[REVIEW_TYPE.DRAFTS] = 'Drafts';

        // functions
        $scope.select = select;
        $scope.hasTransitions = hasTransitions;
        $scope.performAction = performAction;

        var reviewTypesToLoad = [REVIEW_TYPE.READY_TO_CLOSE,
            REVIEW_TYPE.OUT_FOR_REVIEW,
            REVIEW_TYPE.TO_REVIEW,
            REVIEW_TYPE.DRAFTS];

        var promises = reviewTypesToLoad
            // load all reviews in parallel
            .map(function (reviewType) {
                return crucible.getReviews(reviewType)
                    .then(function (reviews) {
                        $scope.reviewsMap[reviewType] = reviews;
                        reviews.forEach(processReview);
                    });
            });

        $q.all(promises)
            .then(function () {
                $scope.loading = false;
            });

        function select(review) {
            $scope.selectedReview = review;
        }

        function hasTransitions(review) {
            return review && review.transitions && review.transitions.transitionData;
        }

        function performAction(review, actionName) {
            crucible.changeState(review.permaId.id, actionName)
                .then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .content(`${actionName} performed`)
                            .position('left bottom')
                            .hideDelay(1000)
                    );
                })
                .catch(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('unable to perform action')
                            .position('left bottom')
                            .hideDelay(1000)
                    );
                });
        }


        function processReview(review) {
            review.actions.actionData.forEach(function (action) {
                switch (action.name) {
                    case REVIEW_ACTION.COMPLETE:
                        // if (review.author is not currentUser) add action to available actions
                        break;
                    case REVIEW_ACTION.SUMMARIZE:
                        // if (review.author is currentUser and all reviewers completed) highlight summarize button
                        break;
                }
            });
        }
    }
})();