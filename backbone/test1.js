/**
 * Created by anita on 15/1/2017.
 */
$(document).ready(function() {
    var TodoItem = Backbone.Model.extend({});
    var TodoView = Backbone.View.extend({
        template: _.template('<h1><%=title%></h1>'),
        render: function () {
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            return this;
        }
    });

    var listToDo =
        [
            {
                "id": 1,
                "title": "Get Up",
                "description": "Get up 9am",
                "done": false
            },
            {
                "id": 2,
                "title": "Make bed",
                "description": "Make the bed for the cat",
                "done": false
            },
            {
                "id": 3,
                "title": "Feed Cat",
                "description": "give cat pro plan",
                "done": false
            }
        ];

    var TodoList = Backbone.Collection.extend({
        model: TodoItem
    });
    var todoList = new TodoList();

    todoList.reset(listToDo);



    var TodoListView = Backbone.View.extend({
        addOne: function(todoItem){
            var todoView = new TodoView({model: todoItem});
            this.$el.append(todoView.render().el);
        },

        render: function () {
            this.collection.each(this.addOne, this);
            return this;
        }

    });

    var todoListView = new TodoListView({collection: todoList});
    $('.task-column').append(todoListView.render().el);

});

