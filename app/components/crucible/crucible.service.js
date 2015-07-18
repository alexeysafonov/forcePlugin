(function () {
    'use strict';

    angular
        .module('forcePluginApp')
        .service('crucible', crucibleService)
        .constant('REVIEW_TYPE', {
            TO_REVIEW: 'toReview',
            OUT_FOR_REVIEW: 'outForReview',
            DRAFTS: 'drafts',
            READY_TO_CLOSE: 'toSummarize',
            COMPLETED: 'completed',
            OPEN: 'open'
        })
        .constant('REVIEW_ACTION', {
            ABANDON: 'action:abandonReview', // abandon (i.e. cancel) a review
            DELETE: 'action:deleteReview', // permanently delete a review
            SUBMIT: 'action:submitReview', // submit a review to the moderator for approval
            APPROVE: 'action:approveReview', // approve a review (i.e. issue it to the reviewers)
            REJECT: 'action:rejectReview', // reject a review submitted for approval
            SUMMARIZE: 'action:summarizeReview', // summarize a review
            CLOSE: 'action:closeReview', // close a review once it has been summarized
            REOPEN: 'action:reopenReview', // re-open a closed review
            RECOVER: 'action:recoverReview', // recover an abandoned review
            COMPLETE: 'action:completeReview', // indicate you have completed a review
            UNCOMPLETE: 'action:uncompleteReview' // indicate you have not completed a review, after indicating you have completed a review
        });

    crucibleService.$inject = ['$http', '$q', '$log'];

    function crucibleService($http, $q, $log) {
        var host = 'https://crucible.epam.com/rest-service',
            reviewsUrl = '/reviews-v1';

        return {
            login: login,
            getReviews: getReviews,
            createReview: createReview,
            changeState: changeState,
            getReviewFiles: getReviewFiles,
            addReviewers: addReviewers,
            availableActions: availableActions
        };

        function login(login, password) {
            return $http.post(`${host}/auth-v1/login`, {
                userName: login,
                password: password
            }).then(function (response) {
                return response.data;
            }).catch(function (response) {
                $log.warn(`Crucible authentication failed: ${response.statusText} - ${response.status}`);
                return $q.reject(response.text);
            });
        }

        function getReviews(type) {
            return $http.get(`${host}${reviewsUrl}/filter/${type}/details`)
                .then(function (response) {
                    return response.data && response.data.detailedReviewData;
                })
                .catch(function (response) {
                    $log.warn(`Crucible failed on loading reviews: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.statusText);
                });
        }

        function createReview(author, name, projectKey, jiraIssueKey, description, creator, moderator) {
            return $http.post(`${host}${reviewsUrl}`, {
                'detailedReviewData': {
                    'allowReviewersToJoin': true,
                    'author': {'userName': author},
                    'creator': {'userName': creator || author},
                    'moderator': {'userName': moderator || author},
                    'description': description || '',
                    'name': name,
                    'projectKey': projectKey,
                    'jiraIssueKey': jiraIssueKey
                }
            }).then(function (response) {
                return response.data && response.data;
            }).catch(function (response) {
                $log.warn(`Crucible failed on creating review: ${response.statusText} - ${response.status}`);
                return $q.reject(response.statusText);
            });
        }

        function changeState(id, state) {
            return $http.post(`${host}${reviewsUrl}/${id}/transition?action=${state}`)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.warn(`Crucible failed on review state change: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.statusText);
                });
        }

        // the same data can be found in review.transitions.transitionData
        function availableActions(id) {
            return $http.get(`${host}${reviewsUrl}/${id}/transitions`)
                .then(function (response) {
                    return response.data && response.data.transitionData;
                })
                .catch(function (response) {
                    $log.warn(`Crucible failed on getting available actions: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.statusText);
                });
        }

        function getReviewFiles(id) {
            return $http.get(`${host}${reviewsUrl}/${id}/reviewitems`)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.warn(`Crucible failed on getting review files: ${response.statusText} - ${response.status}`);
                    return $q.reject(response.statusText);
                });
        }

        function addReviewers(id, reviewers) {
            return $http.post(`${host}${reviewsUrl}/${id}/reviewers`, reviewers.join(','))
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.warn(`Crucible failed on adding reviewers: ${response.statusText} - ${response.status}`);
                    return response.statusText;
                });
        }
    }
})();