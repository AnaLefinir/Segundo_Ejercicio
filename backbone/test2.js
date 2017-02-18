var TodoItem = Backbone.Model.extend({});

var TodoView = Backbone.View.extend({
    template: _.template('<h1><%= title %></h1>'),
    render: function () {
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
        return this;
    }
});

todos = [
    {
    title: 'chuchin'
    },
    {
    title: 'hermosa'
    }
];

var TodoList = Backbone.Collection.extend({
    model: TodoItem
});
var todoList = new TodoList();

todoList.reset(todos);

var TodoListView = Backbone.View.extend({
    addOne: function (todoItem) {
        var todoView = new TodoView({model: todoItem});
        this.$el.append(todoView.render().el);
    },

    render: function () {
        this.collection.each(this.addOne, this);
        return this;
    }
});

var todoListView = new TodoListView({collection: todoList});
$('.chuchin').append(todoListView.render().el);

//var todoView = new TodoView({model: todoItem, el:$('.chuchin')});
