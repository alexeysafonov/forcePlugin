var settings = new Settings();

$(function () {
    var GIT = oauth.systems.GIT,
        projectId;

    $('.icon-branch').click(function () {

        var username = settings.User(),
            password = settings.Password(),
            callback = afterLogin;


        GIT.loginFunction(username, password, callback);
    });

    $('#createBrunch').click(function () {

        GIT.listBrunches(projectId);

    });

    function afterLogin() {
        chrome.storage.sync.get({
            project_name: ''
        }, function(items) {
            var project = encodeURIComponent(items.project_name);
            GIT.getId(project, afterGetId);
        });
    };

    function afterGetId(project){
        projectId = project.id;
        GIT.listBrunches(projectId, afterlistBrunches);
    }

    function afterlistBrunches(list){
        $(list).each(function (index, value) {
            GIT.createBrunch(projectId, value.commit.id, "test");
        });
    }

});