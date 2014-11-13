var jira = new JIRA();
var settings = new Settings();
var crucible = new CRUCIBLE();
var git = new GIT();

$(function () {
    var $tabs = $('.tabs-item'),
        $tabBlocks = $('.js-jira-tab-block, .js-crucible-tab-block'),
        $jiraContainer = $('.js-jira-tab-block'),
        $crucibleContainer = $('.js-crucible-tab-block');

    $('.js-jira-tab').click(function () {
        var $self = $(this),
        credentials = {
            username: settings.User(),
            password: settings.Password()
        };

        jira.auth(credentials, function () {
            jira.getFavoriteFilters(function (filters) {
                showFilters(filters);
                $tabs.removeClass('active');
                $self.addClass('active');
            });
        });
    });

    setTimeout(function () {
        $('.js-jira-tab').click();
        crucible.loginFunction(settings.User(), settings.Password(), function () {
            console.log('success');
        });
    }, 100);

    $('.js-crucible-tab').click(function () {
        openTab($crucibleContainer);
        $tabs.removeClass('active');
        $(this).addClass('active');
        crucible.loginFunction(settings.User(), settings.Password(), function(){
            crucible.getReviews('drafts', function (responce) {
                var template = $('#reviews-tmpl').html(),
                    $renderedReviews = $(Mustache.render(template, responce));

                $renderedReviews.on('click', 'li', function () {
                    $renderedReviews.find('li').removeClass('selected');
                    $(this).addClass('selected');
                });
                $crucibleContainer.find('.js-my-reviews').html($renderedReviews);
            });

            crucible.getReviews('toReview', function (responce) {
                var template = $('#reviews-tmpl').html(),
                    $renderedReviews = $(Mustache.render(template, responce));

                $renderedReviews.on('click', 'li', function () {
                    $renderedReviews.find('li').removeClass('selected');
                    $(this).addClass('selected');
                });
                $crucibleContainer.find('.js-reviews-to-do').html($renderedReviews);
            });
        });
    });

    $('.js-show-toolbar-popup').click(function(){
        if ($(this).closest('.js-toolbar-item').hasClass('selected')) {
            $(this).closest('.js-toolbar-item').removeClass('selected');
            $(this).siblings('.js-toolbar-popup').hide();
        } else {
            $('.js-toolbar-item').removeClass('selected');
            $('.js-toolbar-popup').hide();
            $(this).closest('.js-toolbar-item').addClass('selected');
            $(this).siblings('.js-toolbar-popup').show(); 

            if ($(this).siblings('.js-toolbar-popup').hasClass('create-branch-popup')) {
                var projectId = settings.ProjectId();

                git.listBrunches(projectId, afterlistBrunches);

                function afterlistBrunches(list){
                    $(list).each(function (index, value) {
                        var op = "<option value="+value.commit.id+">"+value.name + "</option>";
                        $("#brunchSelect").append(op);
                    });
                }
            }
        }
    });

    $(document).mouseup(function (e) {
        var container = $('.js-toolbar-popup');
        if (!container.is(e.target)
            && container.has(e.target).length === 0) {
            container.closest('.js-toolbar-item').removeClass('selected');
            container.hide();
        }
    });

    $('.js-show-second-step').click(function() {
        var $ticket = $jiraContainer.find('.entity-list-item.selected'),
            key = $ticket.data('key'),
            type = $ticket.data('type'),
            abbr = settings.Abbr(),
            brunchName = "pre-commit/" + abbr;


        if (type === "Bug") {
            brunchName += "/bugfix";

        } else if (type === "Task") {
            brunchName += "/feature";
        } else {
            brunchName += "/feature";
        }


        brunchName += "/" + key;

         $("#brunchName").val(brunchName);

        $('.first-step').hide();
        $('.second-step').show();

    });

    $('.js-create-branch').click(function(){
        var projectId = settings.ProjectId(),
            commitId = $("#brunchSelect").val(),
            brunchName = $("#brunchName").val();





        git.createBrunch(projectId, commitId, brunchName);

        $('.js-toolbar-popup').hide();
        $('.js-toolbar-item').removeClass('selected');
    });

    function openTab($tabBlock) {
        $tabBlocks.filter(':visible').fadeOut(200, function () {
            $tabBlock.fadeIn(200);
        });
    }

    function showFilters(filters) {
        var template = $('#filters-tmpl').html(),
            $renderedFilters = $(Mustache.render(template, { filters: filters }));

        $renderedFilters.on('click', 'li', function () {
            var jql = $(this).addClass('selected').data('jql');
            jira.searchTickets(jql, function (issues) {
                showTickets(issues);
            })
        });

        $jiraContainer.find('.tab-block').html($renderedFilters);
        $jiraContainer.find('.toolbar').hide();
        openTab($jiraContainer);
    }

    function showTickets(issues) {
        var template = $('#tickets-tmpl').html(),
            $renderedTickets = $(Mustache.render(template, issues));

        $renderedTickets.on('click', 'li', function () {
            $jiraContainer.find('.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $jiraContainer.fadeOut(200, function () {
            $jiraContainer.find('.toolbar').show();
            $jiraContainer.find('.tab-block').html($renderedTickets);
            $jiraContainer.fadeIn(200);
        });
    }

    $('.icon-review').click(function () {
        var $ticket = $jiraContainer.find('.selected');
        if ($ticket.length) {
            crucible.createReview({
                name: '[' + $ticket.data('key') + '] ' + $ticket.data('summary'),
                project: 'CR-VTBRTLB',
                ticket: $ticket.data('key')
            });
        }
    });

    $('.icon-play').click(function () {
        var $ticket = $jiraContainer.find('.selected');
        if ($ticket.length) {
            setTimeout(function () {
                $ticket.find('.status').attr('src', 'https://jira.epam.com/jira/images/icons/statuses/inprogress.png');
            }, 500);
        }
    });
    $('.icon-stop').click(function () {
        var $ticket = $jiraContainer.find('.selected');
        if ($ticket.length) {
            setTimeout(function () {
                $ticket.find('.status').attr('src', 'https://jira.epam.com/jira/images/icons/statuses/open.png');
            }, 500);
        }
    });
    $('.icon-complete').click(function () {
        var $ticket = $jiraContainer.find('.selected');
        if ($ticket.length) {
            setTimeout(function () {
                $ticket.find('.status').attr('src', 'https://jira.epam.com/jira/images/icons/statuses/resolved.png');
            }, 500);
        }
    });

    $('.icon-find-reviewers').click(function () {
        var $ticket = $crucibleContainer.find('.review.selected');
        if ($ticket.length) {
            var key = $ticket.data('key');
            whois(key, function (reviewers) {
                $crucibleContainer.fadeOut(200, function () {
                    var template = $('#reviewers-tmpl').html(),
                        $renderedReviewers = $(Mustache.render(template, reviewers));
                    $crucibleContainer.find('.toolbar').show();
                    $crucibleContainer.find('.tab-block').html($renderedReviewers);
                    $(".entity-list-item").click(function() {
                        var $checkBox = $("input", this);
                        $checkBox.prop("checked", !$checkBox.prop("checked"));
                    });
                    $(".entity-list-item > input").click(function(event) {
                        event.stopPropagation();
                    });
                    $('.review-button').click(function(){
                        var $checked = $('.entity-list-item > input:checked');
                        if ($checked.length > 0) {
                            var selected = $.map($checked.parent(), function (val) {
                                return $('span', val).text().trim();
                            });
                            crucible.addReviewers(key, selected, function(){
                                //todo Возвращение к экрану со списком ревью, необходим жестокий рефакторинг:)
                                var template = $('#review-tab-main').html(),
                                    $renderedContent = $(Mustache.render(template));
                                $crucibleContainer.find('.tab-block').html($renderedContent);
                                $crucibleContainer.fadeOut(200, function () {
                                    crucible.getReviews('drafts', function (responce) {

                                        var template = $('#reviews-tmpl').html(),
                                            $renderedReviews = $(Mustache.render(template, responce));

                                        $renderedReviews.on('click', 'li', function () {
                                            $renderedReviews.find('li').removeClass('selected');
                                            $(this).addClass('selected');
                                        });
                                        $crucibleContainer.find('.js-my-reviews').html($renderedReviews);
                                    });

                                    crucible.getReviews('toReview', function (responce) {
                                        var template = $('#reviews-tmpl').html(),
                                            $renderedReviews = $(Mustache.render(template, responce));

                                        $renderedReviews.on('click', 'li', function () {
                                            $renderedReviews.find('li').removeClass('selected');
                                            $(this).addClass('selected');
                                        });
                                        $crucibleContainer.find('.js-reviews-to-do').html($renderedReviews);

                                    });
                                    $crucibleContainer.fadeIn(200);
                                })
                            })
                        }
                    })
                    $crucibleContainer.fadeIn(200);
                });
            })
        }
    });
});