/**
 * Created by Anita on 10/09/2016.
 */

$(document).ready(function () {
    $.getJSON('/task', appendTasks);

    $('form').on('submit', addTask);

    $('.del').on('click', removeTask);
});

function appendTasks(tasks) {
    var taskElements = $.map(tasks, createTaskElement);
    console.log('appendTasks');
    console.log(tasks);
    console.log(taskElements);
    $('.columnTask').append(taskElements);
}

function createTaskElement(task) {
    var listTask = $('<div></div>');
    $('<input />', {type: 'checkbox'}).appendTo(listTask);
    $('<h2>' + task.title + '</h2>').appendTo(listTask);
    $('<p>' + task.description + '</p>').appendTo(listTask);

    var deleteEl = $('<a class="del" href="#" data-id="' + task.id + '">x</a>');
    deleteEl.on('click', removeTask);
    deleteEl.appendTo(listTask);

    listTask.addClass('task');

    return listTask;
}

function addTask(event) {
    event.preventDefault();
    var form = $(this);
    var taskData = form.serialize();
    console.log('from submit: ' + taskData);

    $.ajax({
        type: 'POST',
        url: '/actions/post',
        data: taskData,
        success: function (task) {
            appendTasks([task]);
            form.trigger('reset');
        },
        error: showAjaxError
    });
}

function removeTask(event) {
    var target = $(event.currentTarget);

    $.ajax({
        type: 'DELETE',
        url: '/actions/delete/' + target.data('id'),
        success: function () {
            target.parents('.task').remove();
        },
        error: showAjaxError
    });
}

function showAjaxError(xhr, status, error) {
    console.log('[' + status + '] ' + error);
}
