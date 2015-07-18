(function () {
    'use strict';

    angular
        .module('whoIs', [])
        .service('whoIsService', whoIsService);

    whoIsService.$inject = ['$http', '$q'];

    function whoIsService($http, $q) {
        var host = 'http://evrusarsd0b13:8080/whois.svc/';

        this.findReviewers = function (crucibleReviewKey) {
            return $http.get(host + crucibleReviewKey)
                .then(function (responce) {
                    if (responce.data.indexOf('Currently absent reviewers') != -1) {
                        return $(responce.data)
                            .find('#t2 td:gt(0)')
                            .map(function (i, el) {
                                return el.innerText;
                            })
                            .get();
                    } else {
                        return [];
                    }
                })
                .catch(function (responce) {
                    return $q.reject(responce.statusText);
                });
        }
    }
})();