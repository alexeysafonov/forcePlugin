(function () {
    "use strict";

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

    crucibleService.$inject = ['$http', '$q', '$log'];

    function crucibleService($http, $q, $log) {
        var host = 'https://crucible.epam.com/rest-service',
            reviewsUrl = '/reviews-v1';

        this.login = function (login, password) {
            return $http.post(host + '/auth-v1/login', {
                userName: login,
                password: password
            }).then(function (responce) {
                return responce.data;
            }).catch(function (responce) {
                $log.warn('Crucible authentication failed: %s - %s', responce.statusText, responce.status);
                return $q.reject(responce.text);
            });
        };

        this.getReviews = function (type) {
            return $http.get(host + reviewsUrl + '/filter/' + type + '/details')
                .then(function (responce) {
                    return responce.data.detailedReviewData;
                })
                .catch(function (responce) {
                    $log.warn('Crucible failed on loading reviews: %s - %s', responce.statusText, responce.status);
                    return $q.reject(responce.statusText);
                });
        };

        this.createReview = function (author, name, projectKey, jiraIssueKey, description, creator, moderator) {
            return $http.post(host + reviewsUrl, {
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
            }).then(function (responce) {
                return responce.data;
            }).catch(function (responce) {
                $log.warn('Crucible failed on creating review: %s - %s', responce.statusText, responce.status);
                return $q.reject(responce.statusText);
            });
        };

        this.getReviewFiles = function (id) {
            return $http.get(host + reviewsUrl + '/' + id + '/reviewitems')
                .then(function (responce) {
                    return responce.data;
                })
                .catch(function (responce) {
                    $log.warn('Crucible failed on getting review files: %s - %s', responce.statusText, responce.status);
                    return $q.reject(responce.statusText);
                });
        }

        this.addReviewers = function (id, reviewers, callback) {
            var postUrl = host + reviewsUrl + '/' + id + '/reviewers';
            var data = reviewers.join(",");

            //TODO Вынести
            //Статус 204(не 200!!) сигнализирует об успещности. Тела респонса нет
            $.ajax({
                url: postUrl,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                // Самое главное этот флаг, он предотвращает обработку данных и отправляет "сырую строку"
                processData: false,
                data: data,
                success: callback
            });
        }
    }
})();