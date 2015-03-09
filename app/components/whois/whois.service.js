(function () {
    "use strict";

    angular
        .module('whoIs', [])
        .service('whoIsService', whoIsService);

    whoIsService.$inject = ['$http', '$q'];

    function whoIsService($http, $q) {
        var host = 'http://evrusarsd0b13:8080/whois.svc/';

        this.findReviewers = function (crucibleReviewKey) {
            return $http.get(host + crucibleReviewKey)
                .then(function (responce) {
                    var reviewers = [];
                    // parsing html
                    return reviewers;
                })
                .catch(function (responce) {
                    return $q.reject(responce.statusText);
                });
        }
    }
})();