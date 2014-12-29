forcePluginApp.service('git', ['$http',
    function ($http) {
        var url = "https://git.epam.com/api/v3",
            token = null,
            getToken = '/session',
            projects = '/projects/',
            branches = '/repository/branches';

        this.loginFunction = function (login, password, callback) {
            var data = {'login': login, 'password': password};
            var url = this.url + this.getToken;
            ajaxPostToSystem(url, data,
                function (response) {
                    oauth.systems.GIT.token = response.private_token;
                    callback();
                })
        };

        this.getId = function (project, callback) {
            var data = {'private_token': oauth.systems.GIT.token};
            var url = this.url + this.projects + project;
            ajaxToSystem(url, data,
                function (response) {
                    callback(response);
                })
        };

        this.listBrunches = function (projectId) {
            var data = {'private_token': oauth.systems.GIT.token};
            var url = this.url + this.projects + '/' + projectId + this.branches;
            ajaxToSystem(url, data,
                function (response) {
                    $(response).each(function () {
                        //this.commit.id - hed commit id
                        //this.name -  name
                    });
                    $("#create").show();
                })
        };

        this.createBrunch = function (project, brunchName) {
            var projectId = this.getId(project),
                data = {
                    'private_token': oauth.systems.GIT.token,
                    'branch_name': brunchName,
                    'ref': 'head commit id'
                },
                url = this.url + this.projects + '/' + projectId + this.branches;

            oauth.ajaxPostToSystem(url, data,
                function (response) {

                })
        }
    }]);