/**
 * Created by Anita on 10/09/2016.
 */

$(document).ready(function () {
    $.getJSON('/api/tasks', appendTasks);

    $('form').on('submit', addTask);

    $('.del').on('click', removeTask);
});

function appendTasks(tasks) {
    var taskElements = $.map(tasks, createTaskElement);
    $('.task-column').append(taskElements);

}


function createTaskElement(task) {
    var $listTask = $('<div></div>');
    var $checkElement = $('<input />', {type: 'checkbox', checked: task.done}).addClass('check-element');
    $checkElement.data({'taskId': task.id});
    $checkElement.on('change', updateTaskStatus);
    $checkElement.appendTo($listTask);


    var $title = $('<h2>' + task.title + '</h2>');
    $title.appendTo($listTask);

    $('<p>' + task.description + '</p>').appendTo($listTask);

    var $deleteEl = $('<a class="del" href="#" data-id="' + task.id + '">x</a>');
    $deleteEl.on('click', removeTask);
    $deleteEl.appendTo($listTask);

    $listTask.addClass('task');
    if(task.done){
        $title.addClass('set-check');
    }

    return $listTask;
}

function addTask(event) {
    event.preventDefault();
    var form = $(this);
    var taskData = form.serialize();

    $.ajax({
        type: 'POST',
        url: '/api/tasks',
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
        url: '/api/tasks/' + target.data('id'),
        success: function () {
            target.parents('.task').remove();
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
    var targetId = $target.data('taskId');
    var isCheck = $target.is(':checked');

    $.ajax({
        type: 'PUT',
        url: '/api/tasks/' + targetId,
        data: {done: isCheck},
        success: function () {
            if (!isCheck) {
                $target.closest('div').find('h2').removeClass('set-check');
            } else {
                $target.closest('div').find('h2').addClass('set-check');
            }
        },
        error: showAjaxError
    })
}

/*function registerTaskEvent(){
    $('.del').on('click', removeTask);
    $checkElement.on('change', updateTaskStatus);
}*/