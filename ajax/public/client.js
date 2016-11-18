/**
 * Created by Anita on 10/09/2016.
 */

$(document).ready(function () {
    $.getJSON('/api/tasks', appendTasks);

    $('form').on('submit', addTask);

    $('input').focus(focusInput)
              .blur(blurInput);

    $('textarea').on('click', onTextarea);

    $('#input').popover();

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

        $('.del').on('click', addModalToDeleteBtn);
        $('.check-element').on('change', updateTaskStatus);

        function addModalToDeleteBtn(event) {
            var $target = $(event.currentTarget);
            var titleTask;
            var id = $(this).data('id');

            $target.parents('.container').find('#input-required').removeClass('has-error');

            for (var i = 0; i < context.length; i++) {
                if (context[i].id === id) {
                    titleTask = context[i].title;
                }
            }
            $(".modal-body #strongTitle").text(titleTask);


            $('#confirm-delete').modal('toggle');

            $('.btn-ok').one('click', function () {
                removeTask($target.data('id'));
                $target.parents('.task').remove();
                $("#confirm-delete").modal('hide');
            })
        }

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

    var $form = $(this);
    var $inputRequired = $form.find('input.form-control');
    var inputRequiredTitle = $inputRequired.val();
    var inputRequiredData = $inputRequired.data('pass');
    var $divContainerInput = $inputRequired.parents('#input-required');


    if ((inputRequiredData === 'false' && inputRequiredTitle === '') || (inputRequiredData === '' && inputRequiredTitle === '')) {

        $inputRequired.data('pass', 'false');

        $('#empty-title').modal('show');

    } else if ((inputRequiredData === '' && inputRequiredTitle !== '') || (inputRequiredData === 'true' && inputRequiredTitle !== '')) {

        if (inputRequiredData === 'true') {

            ajaxCall();

        } else if (inputRequiredData === '') {

            analizeTitleAndDecide();
        }

    } else if(inputRequiredData === 'false' && inputRequiredTitle !== ''){

        analizeTitleAndDecide();

    } else{
        console.log('esto es un error!');
        console.log('data: '+inputRequiredData+'.'+'title: '+inputRequiredTitle);
    }



    function analizeTitleAndDecide(){
        var title = $inputRequired.val();
        var resultRegex = validateAlphanumeric(title);

        if (resultRegex === false) {

            $inputRequired.data('pass', 'false');
            $divContainerInput.addClass('has-error');

            $('#invalid-title').modal('show');
        } else {

            ajaxCall();
        }
    }

    function ajaxCall() {

        var taskData = $form.serialize();

        $divContainerInput.removeClass('has-success');
        $inputRequired.data('pass', 'false');

        $.ajax({
            type: 'POST',
            url: '/api/tasks',
            data: taskData,
            success: function (tasks) {
                appendTasks(tasks);
                $form.trigger('reset');
            },
            error: showAjaxError
        });
    }
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
            $target.parents('.container').find('#input-required').removeClass('has-error');
        },
        error: showAjaxError
    })
}

function blurInput() {
    var $target = $(this);
    var textInput = $target.val();
    var $targetParentDiv = $target.parent('div');
    var resultRegex = validateAlphanumeric(textInput);

    if (!resultRegex) {
        $targetParentDiv.addClass('has-error');
        $target.data('pass', 'false');
        $('#invalid-title').modal('show');
    } else {
        $targetParentDiv.addClass('has-success').removeClass('has-error');
        $target.data('pass', 'true');
    }
}

function focusInput() {
    var $target = $(this);
    $target.parent('div').addClass('has-error');
}

function onTextarea() {
    var $target = $(this);
    var $requiredInput = $target.closest('form').find('input.form-control');

    if ($requiredInput.data('pass') === 'false' || $requiredInput.data('pass') === '') {
        $requiredInput.parents('#input-required').addClass('has-error');
        $requiredInput.data('pass', 'false')
    }
}

function showAjaxError(xhr, status, error) {
    console.log('[' + status + '] ' + error);
}

function validateAlphanumeric(string) {
    var regex = /^[-a-z0-9,\/()&:. ]*[a-z][-a-z0-9,\/()&:. \!]*$/;
    var reSource = regex.source;
    var regexFinal = new RegExp(reSource, 'i');

    return regexFinal.test(string);
};
