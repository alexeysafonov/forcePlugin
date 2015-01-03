forcePluginApp.service('crucible', ['$http',
    function ($http) {
        var token = '',
            user = '',
            url = 'https://crucible.epam.com/rest-service',
            reviewsUrl = '/reviews-v1',
            auth = '/auth-v1/login',
            filter = '/filter/',
            details = '/details',
            reviewersURL = '/reviewers',
            items = '/reviewitems',
            filterTypes = {toReview: 'toReview', open: 'open'};

        this.loginFunction = function (login, password, responseFunction) {
            var urlPost = url + auth;
            var data = 'userName=' + login + '&password=' + password;
            user = login;
            postForm(urlPost, data, function () {
                token = this.token;
                responseFunction();
            });
        };

        this.getReviews = function (type, callback) {
            var postUrl = url + reviewsUrl + filter + type + details;
            ajaxToSystem(postUrl, {}, function (responce) {
                callback(responce);
            });
        };

        this.createReview = function (params) {
            var jsonRequest = {
                'detailedReviewData': {
                    'allowReviewersToJoin': true,
                    'author': {'userName': user},
                    'creator': {'userName': user},
                    'moderator': {'userName': user},
                    'description': params.description || '',
                    'name': params.name,
                    'projectKey': params.project,
                    'jiraIssueKey': params.ticket
                }
            };
            var urlPost = url + reviewsUrl;
            this.cruPost(urlPost, jsonRequest, function (responce) {
                window.open('https://crucible.epam.com/cru/' + responce.permaId.id, '');
            })
        };

        this.getReviewFiles = function (id, callback) {
            var postUrl = url + reviewsUrl + '/' + id + items
            ajaxToSystem(postUrl, {}, function (responce) {
                callback(responce);
            });
        }

        this.addReviewers = function (id, reviewers, callback) {
            var postUrl = url + reviewsUrl + '/' + id + reviewersURL;
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

        this.whoIs = function (jiraTicket, callback) {
            var url = 'http://evrusarsd0b13:8080/whois.svc/' + jiraTicket;
            ajaxToSystem(url, {}, function (resp) {
                var el = $(resp);
                var table = $('table#t3', el)
                var columns = $('tr:gt(1) td:nth-child(n+3)', table);
                var revs = $.map(columns, function (val) {
                    return $(val).text().trim();
                });
                // $.unique(revs) - оставиит пустаые значения
                callback($.unique(revs).filter(function (e) {
                    return e
                }));
            });
        }
    }
]);