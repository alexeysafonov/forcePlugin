var git = new GIT();

var Settings = function () {

    var projectName,
        projectId,
        userName,
        userPassword

    this.Project = function () {
        return projectName;
    };

    this.ProjectId = function () {
        return projectId;
    };


    this.User = function () {
        return userName;
    };

    this.Password = function () {
        return userPassword;
    };

    this.Abbr = function () {
        var odin =  userName.substr(0,1),
            dva =  userName.substr(userName.indexOf("_")+1, 1);

        return odin+dva;
    };

    $('#saveSettings').click(function () {
        save_options();
    });

    $(document).ready(function () {
        restore_options();
    });

    function save_options() {
        var userName = $('#userName').val(),
            userPassword = $('#userPassword').val(),
            projectName = $('#projectName').val();

        chrome.storage.sync.set({
            user_name: userName,
            password_name: userPassword,
            project_name: projectName
        }, function () {
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    }

    function restore_options() {
        chrome.storage.sync.get({
            user_name: '',
            password_name: '',
            project_name: 'hackathons/rzn14-forcepush'
        }, function (items) {
            userName = items.user_name;
            userPassword = items.password_name;
            projectName = items.project_name;

            $('#userName').val(userName);
            $('#userPassword').val(userPassword);
            $('#projectName').val(projectName);

            git.loginFunction(userName, userPassword, afterLogin);

        });
    }

    function afterLogin() {
        git.getId(encodeURIComponent(projectName), afterGetId);
    }

    function afterGetId(project) {
        projectId = project.id;
    }
}

new Settings();