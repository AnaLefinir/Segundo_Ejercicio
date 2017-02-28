/**
 * Created by anita on 18/2/2017.
 */
$(document).ready(function () {


    var TodoModel = Backbone.Model.extend({
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
        template: Handlebars.compile( $('#template').html() ),
        render: function () {
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            return this;
        }
    });

    var TodoCollectionView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        addOne: function(todoModel){
            var todoView = new TodoView({model: todoModel});
            this.$el.append(todoView.render().el);
        },

        render: function () {
            this.collection.each(this.addOne, this);
            return this;
        }

    });


    var todoCollectionView = new TodoCollectionView({collection: todoCollection});
    todoCollection.fetch({
        success: function(){
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
        template: Handlebars.compile( $('#addTodoTemplate').html() ),
        events: {
            'click button': 'addTodo'
        },
        addTodo: function (e) {
            e.preventDefault();
            var newTitle = this.$('input[name=title]').val();
            var newDescription = this.$('textarea[name=description]').val();
            console.log(this.model);
            this.model.save({title: newTitle, description: newDescription}, {success: function (model, response) {
                var newView = new TodoView ({model: model});
                $('.task-column').append(newView.render().el);
            }});
        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    var todoItem = new TodoModel();
    var todoForm = new AddTodoView({model: todoItem});
    console.log(todoForm.render().el);
    $('.displayForm').html(todoForm.render().el);
});