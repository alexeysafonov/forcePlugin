var oauth = oauth || {};

oauth.systems = {
    GIT: {
        url: "https://git.epam.com/api/v3",
        token: null,
        getToken: '/session',
        projects: '/projects/',
        branches: '/repository/branches',
        loginFunction: function (login, password, callback) {
            var data = {'login': login, 'password': password};
            var url = this.url + this.getToken;
            ajaxPostToSystem(url, data,
                function (response) {
                    oauth.systems.GIT.token = response.private_token;
                    callback();
                })
        },
        getId: function (project, callback) {
            var data = {'private_token': oauth.systems.GIT.token};
            var url = this.url + this.projects + project;
            ajaxToSystem(url, data,
                function (response) {
                    callback(response);
                })
        },
        listBrunches: function (projectId) {
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
        },
        createBrunch: function (project, brunchName) {

            var projectId;

            projectId = this.getId(project);

            var data = {'private_token': oauth.systems.GIT.token,
                'branch_name': brunchName,
                'ref': 'head commit id'
            };

            var url = this.url + this.projects + '/' + projectId + this.branches;
            oauth.ajaxPostToSystem(url, data,
                function (response) {

                })
        }
    },

    JIRA: {
    }
}
;

$('#oauth').click(function () {
    oauth.systems.CRUCIBLE.loginFunction(credentials.username, credentials.password);
});