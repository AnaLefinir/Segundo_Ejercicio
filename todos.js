/**
 * Created by Anita on 26/08/2016.
 */
var _ = require('underscore');

var listToDo =
    [
        {
            "id": 3,
            "title": "Feed Cat",
            "description": "give cat pro plan"
        },
        {
            "id": 2,
            "title": "Make bed",
            "description": "Make the bed for the cat"
        },
        {
            "id": 1,
            "title": "Get Up",
            "description": "Get up 9am"
        }
    ];

exports.list = function(){
    return (listToDo);
};

exports.addToList = function (data) {
    var maxId = _.max(listToDo, function (item) { return item.id });
    var newTodoItem = { "id": maxId.id + 1, "title": data.title, "description": data.description };
    listToDo.unshift(newTodoItem);
};

exports.deleteToList = function (id){
    listToDo.splice(_.findIndex(listToDo, function(obj) { return obj.id == id }),1);
};

