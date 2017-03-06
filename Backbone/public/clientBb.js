/**
 * Created by anita on 18/2/2017.
 */
$(document).ready(function () {
    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
    _.extend(Backbone.Validation.callbacks, {
        valid: function (view, name, selector) {
            var $el = view.$('[name=' + name + ']');
            $el.removeClass('has-error');
            var $errorDisplay = $el.siblings('.error-description');
            $errorDisplay.addClass('hidden')
        },
        invalid: function (view, name, error, selector) {
            var $el = view.$('[name=' + name + ']');
            $el.addClass('has-error');
            var $errorDisplay = $el.siblings('.error-description');
            $errorDisplay.html(error);
            $errorDisplay.removeClass('hidden');
        }
    });

    Backbone.eventsMine = _.extend({}, Backbone.Events);

    /**
     * Backbone
     */

    var TodoModel = Backbone.Model.extend({
        defaults: {
            title: null,
            description: null,
            done: false
        },
        validation: {
            title: {
                fn: function (value, attr) {
                    return validateAlphanumeric(value);
                }
            },
            description: {
                required: true,
                msg: 'Please enter a description'
            }
        },
        urlRoot: '/api/tasks',
    });


    var TodoCollection = Backbone.Collection.extend({
        model: TodoModel,
        url: '/api/tasks'
    });
    var todoCollection = new TodoCollection();


    var TodoView = Backbone.View.extend({
        initialize: function () {
            this.render();
            this.model.bind('change', this.refreshForm, this);
            Backbone.Validation.bind(this);
        },
        events: {
            'click .del': 'confirmRemoveTask',
            'click .check-element': 'changeStatus',
            'click .edit': 'editTask'
        },
        template: Handlebars.compile($('#template').html()),
        render: function () {
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            if (this.model.get('done') === true) {
                $(this.el).addClass('set-opacity');
                $(this.el).find('.title-' + this.model.get('id')).addClass('set-check');
            }
            return this;
        },
        confirmRemoveTask: function () {
            var that = this;
            var modal = new ModalView({
                model: that.model,
                removeTask: function () {
                    that.el.remove();
                    that.model.destroy();
                },
                body: 'BODY'
            });
            modal.render();
        },
        changeStatus: function () {
            var self = this;
            if (this.model.get('done') === false) {
                this.model.set({'done': true});
                this.model.save(null, {
                    url: '/api/tasks/status/' + this.model.get('id')
                });
                $(self.el).addClass('set-opacity');
                $(self.el).find('.title-' + self.model.get('id')).addClass('set-check');
            } else {
                this.model.set({'done': false});
                this.model.save(null, {
                    url: '/api/tasks/status/' + this.model.get('id')
                });
                $(self.el).removeClass('set-opacity');
                $(self.el).find('.title-' + self.model.get('id')).removeClass('set-check');
            }
        },
        editTask: function () {
            var todoForm = new AddTodoView({model: this.model});
            $('.displayForm').html(todoForm.render().el);
            $('#input').val(this.model.get('title'));
        },
        refreshForm: function () {
            if (this.model.isValid(true)) {
                this.render();
            } else {
                setTimeout(emptyForm, 2000);
            }
        }
    });


    var TodoCollectionView = Backbone.View.extend({
        initialize: function () {
            this.collection.on('add', this.addOne, this);
        },

        addOne: function (todoModel) {
            var todoView = new TodoView({model: todoModel});
            this.$el.append(todoView.render().el);
        }
    });

    var todoCollectionView = new TodoCollectionView({collection: todoCollection});
    todoCollection.fetch({
        success: function () {
            $('.task-column').append(todoCollectionView.render().el);
        },
        error: function () {
            console.log('auch!');
        }
    });


    var AddTodoView = Backbone.View.extend({
        initialize: function () {
            Backbone.Validation.bind(this);
        },
        template: Handlebars.compile($('#addTodoTemplate').html()),
        events: {
            'click button': 'addTodo'
        },
        addTodo: function (e) {
            var self = this;
            e.preventDefault();
            var data = getTaskData(self.$el);

            this.model.set(data);
            if (this.model.get('id') == undefined) {
                if (this.model.isValid(true)) {
                    self.model.save(null, {
                        success: function (model, response) {
                            todoCollection.add(model);
                            self.model = new TodoModel();
                            Backbone.Validation.bind(self);
                            self.render();
                        }, error: function (model, response, options) {
                            console.log(response);
                        }
                    });
                }
            } else {
                if (this.model.isValid(true)) {
                    self.model.save(null, {
                        url: '/api/tasks/update/' + this.model.get('id'),
                        success: function (model, response) {
                            todoCollection.add(model);
                            self.model = new TodoModel();
                            Backbone.Validation.bind(self);
                            self.render();
                        }, error: function (model, response, options) {
                            console.log(response);
                        }
                    });
                }
            }


        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    emptyForm();

    var ModalView = Backbone.View.extend({
        el: '#confirm-modal',
        events:{
            'click .btn-ok': 'runCallBack'
        },
        initialize: function(args){
            $(".modal-body #strongTitle").text(args.model.get('title'));
            this.removeTask = args.removeTask;
        },
        render: function(){
            this.$el.modal("show");
        },
        close: function(){
            this.$el.modal("close");
        },
        runCallBack: function(){
            this.removeTask();
        }

    });

    function getTaskData($el) {
        var title = $el.find("input[name='title']").val();
        var description = $el.find("textarea[name='description']").val();

        return {
            title: title,
            description: description
        };
    }

    function validateAlphanumeric(string) {
        var regex = /^[-a-z0-9,\/()&:. ]*[a-z][-a-z0-9,\/()&:. \!]*$/;
        var reSource = regex.source;
        var regexFinal = new RegExp(reSource, 'i');
        var result = regexFinal.test(string);

        if (!result) {
            return "Please enter a valid title";
        }
    }

    function emptyForm() {
        var todoItem = new TodoModel();
        var todoForm = new AddTodoView({model: todoItem});
        $('.displayForm').html(todoForm.render().el);
    }
});
/**render: function () {
    $(".modal-body #strongTitle").text(this.model.get('title'));
    $('#confirm-delete').modal('toggle');
}**/