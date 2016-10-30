/**
 * Created by Anita on 26/08/2016.
 */
var _ = require('lodash');

var listToDo =
    [
        {
            "id": 1,
            "title": "Get Up",
            "description": "Get up 9am"
        },
        {
            "id": 2,
            "title": "Make bed",
            "description": "Make the bed for the cat"
        },
        {
            "id": 3,
            "title": "Feed Cat",
            "description": "give cat pro plan"
        }
    ];

exports.list = function(){
    return (listToDo);
};

exports.addToList = function (data) {
    var maxId = _.maxBy(listToDo, function (item) { return item.id });
    var newTodoItem = { "id": maxId.id + 1, "title": data.title, "description": data.description };
    listToDo.push(newTodoItem);
};

exports.deleteToList = function (id){
    listToDo.splice(_.findIndex(listToDo, function(obj) { return obj.id == id }),1);
};

