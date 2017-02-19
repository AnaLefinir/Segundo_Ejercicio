/**
 * Created by anita on 18/2/2017.
 */
$(document).ready(function () {


    var TodoModel = Backbone.Model.extend({
        defaults: {
            id: 0,
            title: null,
            description: null,
            done: false
        }
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



});