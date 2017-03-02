/**
 * Created by anita on 18/2/2017.
 */
$(document).ready(function () {

    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
    _.extend(Backbone.Validation.callbacks, {
        valid: function (view, name, selector) {
            console.log('ok!');
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

    var TodoModel = Backbone.Model.extend({
        defaults: {
            title: null,
            description: null,
            done: false
        },
        validation: {
            title: {
                required: true,
                msg: 'Please enter a title'
            },
            description: {
                required: true,
                msg: 'Please enter a description'
            }
        },
        urlRoot: '/api/tasks'
    });

    var TodoCollection = Backbone.Collection.extend({
        model: TodoModel,
        url: '/api/tasks'
    });
    var todoCollection = new TodoCollection();


    var TodoView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        template: Handlebars.compile($('#template').html()),
        render: function () {
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            return this;
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

    /**
     * Inicio addTask
     */

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
            if (this.model.isValid(true)) {
                self.model.save(null, {
                    success: function (model, response) {
                        todoCollection.add(model);
                        self.model = new TodoModel();
                        //Backbone.Validation.bind(self);
                        //self.render();
                    }, error: function(model, response, options){
                        console.log(response);
                    }
                });
            }

        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    var todoItem = new TodoModel();
    var todoForm = new AddTodoView({model: todoItem});
    $('.displayForm').html(todoForm.render().el);


    function validateAlphanumeric(string) {
        var regex = /^[-a-z0-9,\/()&:. ]*[a-z][-a-z0-9,\/()&:. \!]*$/;
        var reSource = regex.source;
        var regexFinal = new RegExp(reSource, 'i');

        return regexFinal.test(string);
    }

    function getTaskData($el) {
        var title = $el.find("input[name='title']").val();
        var description = $el.find("textarea[name='description']").val();

        return {
            title: title,
            description: description
        };
    }
});