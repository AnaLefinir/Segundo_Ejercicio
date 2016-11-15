/**
 * Created by Anita on 10/09/2016.
 */

$(document).ready(function () {
    $.getJSON('/api/tasks', appendTasks);

    $('form').on('submit', addTask);

});

function appendTasks(tasks) {
    getTemplateAjax('/templates/demo.handlebars', function (template) {
        //do something with compiled template
        var context = tasks.reverse();
        var taskForDisplay = template(context);

        $('.task-column').html(taskForDisplay);

        for (var i = 0; i < context.length; i++) {
            if (context[i].done) {
                $('.check-element').closest('div').find('.title-' + context[i].id).addClass('set-check');
                $('.task-' + context[i].id).addClass("set-opacity");
            }
        }

        $('.del').on('click', function (event) {
            var target = $(event.currentTarget);
            var titleTask;
            var id = $(this).data('id');

            for (var i = 0; i < context.length; i++) {
                if (context[i].id === id) {
                    titleTask = context[i].title;
                }
            }
            $(".modal-body #strongTitle").text(titleTask);



            $('#confirm-delete').modal('toggle');

            $('.btn-ok').one('click', function () {
                removeTask(target.data('id'));
                target.parents('.task').remove();
                $("#confirm-delete").modal('hide');
            });

        });


        $('.check-element').on('change', updateTaskStatus);
    });
}


function getTemplateAjax(path, callback) {
    var source;
    var template;

    $.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);

            //execute the callback if passed
            if (callback) callback(template);
        }
    })
}

function addTask(event) {
    event.preventDefault();
    var form = $(this);
    var taskData = form.serialize();

    $.ajax({
        type: 'POST',
        url: '/api/tasks',
        data: taskData,
        success: function (tasks) {
            appendTasks(tasks);
            form.trigger('reset');
        },
        error: showAjaxError
    });
}

function removeTask(id) {

    $.ajax({
        type: 'DELETE',
        url: '/api/tasks/' + id,
        success: function () {
            console.log('success!');
        },
        error: showAjaxError
    });
}

function showAjaxError(xhr, status, error) {
    console.log('[' + status + '] ' + error);
}

function updateTaskStatus($event) {
    $event.preventDefault();
    var $target = $($event.currentTarget);
    var targetId = $target.data('id');
    var isCheck = $target.is(':checked');

    $.ajax({
        type: 'PUT',
        url: '/api/tasks/' + targetId,
        data: {done: isCheck},
        success: function () {
            if (!isCheck) {
                $target.closest('div').find('.title-' + targetId).removeClass('set-check');
                $('.task-' + targetId).removeClass('set-opacity');
            } else {
                $target.closest('div').find('.title-' + targetId).addClass('set-check');
                $('.task-' + targetId).addClass('set-opacity');
            }
        },
        error: showAjaxError
    })
}
