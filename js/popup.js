function post(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: callback
    });
}

function postForm(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: callback,
        headers: { 'Accept': 'application/json' },
        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function ajaxPostToSystem(url, data, responseFunction) {
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: function (response) {
            responseFunction(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}

function ajaxToSystem(url, data, responseFunction) {
    $.ajax({
        url: url,
        data: data,
        contentType: 'application/json',
        headers: { 'Accept': 'application/json'},
        success: function (response) {
            responseFunction(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}

var JIRA = function () {

    var authUrl = 'https://jira.epam.com/jira/rest/auth/1/session',
        searchUrl = 'https://jira.epam.com/jira/rest/api/2/search',
        favoriteFiltersUrl = 'https://jira.epam.com/jira/rest/api/2/filter/favourite?expand=false'

    this.auth = function (credentials, callback) {
        post(authUrl, credentials, callback);
    };

    this.getFavoriteFilters = function (callback) {
        $.getJSON(favoriteFiltersUrl, function(data) {
            data.push({
                name: 'Assigned to me',
                jql: 'assignee = currentUser() AND resolution = Unresolved'
            });
            callback(data);
        });
    };

    this.searchTickets = function (jql, callback) {
        $.getJSON(searchUrl, {
            "jql": jql,
            "startAt": 0,
            "maxResults": 15,
            "fields": [
                "summary",
                "status",
                "assignee",
                "issuetype"
            ]
        }, callback);
    }
}

var CRUCIBLE = function() {
    var token='',
        user='',
        url='https://crucible.epam.com/rest-service',
        reviewsUrl='/reviews-v1',
        auth= '/auth-v1/login',
        filter= '/filter/',
        details= '/details',
        reviewersURL='/reviewers',
    items = '/reviewitems',
        filterTypes = {toReview : 'toReview', open: 'open'};

        this.cruPost = function(url, data, responseFunction) {
        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            dataType: 'json',
            success: function (response) {
                responseFunction(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
    };
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
                }};
        var urlPost = url + reviewsUrl;
        this.cruPost(urlPost, jsonRequest, function (responce) {
            window.open('https://crucible.epam.com/cru/' + responce.permaId.id, '');
        })
    };
    /**
     * perform <fileType>File</fileType>
     * @param id - review id
     */
    this.getReviewFiles = function(id, callback){
        var postUrl = url +  reviewsUrl + '/' + id + items
        ajaxToSystem(postUrl, {}, function (responce) {
            callback(responce);
        });
    }

    this.addReviewers = function(id, reviewers, callback){
        var postUrl = url +  reviewsUrl + '/' + id + reviewersURL;
        var data = reviewers.join(",");

        post(postUrl, data, function (responce) {
            callback(responce);
        });
    }
}
var whois = function(jiraTicket, callback) {
    var url = 'http://evrusarsd0b13:8080/whois.svc/' + jiraTicket;
    ajaxToSystem(url, {}, function(resp){
        var el = $(resp);
        var table = $('table#t3', el)
        var columns = $('tr:gt(1) td:nth-child(n+3)', table);
        var revs = $.map(columns, function (val) {
            return $(val).text().trim();
        });
        // $.unique(revs) - оставиит пустаые значения
        callback($.unique(revs).filter(function(e){return e}));
    })

}
var GIT = function () {

    var apiUrl = "https://git.epam.com/api/v3",
        token = null,
        getToken = '/session',
        projects ='/projects/',
        branches = '/repository/branches';


    this.loginFunction = function (login, password, callback) {
        var data = {'login': login.toLowerCase(), 'password': password};
        var url = apiUrl + getToken;
        ajaxPostToSystem(url, data,
            function (response) {
                token = response.private_token;
                callback();
            })
    };

    this.getId = function (project, callback) {
        var data = {'private_token': token};
        var url = apiUrl + projects + project;
        ajaxToSystem(url, data,
            function (response) {
                callback(response);
            })
    };

    this.listBrunches = function (projectId, callback) {
        var data = {'private_token': token};
        var url = apiUrl + projects + '/' + projectId + branches;
        ajaxToSystem(url, data,
            function (response) {
                callback(response);
            })
    };

    this.createBrunch = function (projectId, commitId, brunchName) {

        var data = {'private_token': token,
            'branch_name': brunchName,
            'ref': commitId
        };

        var url = apiUrl + projects + '/' + projectId + branches;
        ajaxPostToSystem(url, data,
            function (response) {

            })
    };

}