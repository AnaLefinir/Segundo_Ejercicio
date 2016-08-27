/**
 * Created by Anita on 26/08/2016.
 */
var _ = require('underscore');

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
    var maxId = _.max(listToDo, function (item) { return item.id });
    console.log(data);
    var newTodoItem = { "id": maxId.id + 1, "title": data.title, "description": data.description };
    listToDo.unshift(newTodoItem);
};

exports.deleteToList = function (id){
    var indexes = listToDo.map(function(obj, index) {
        if(obj.id == id) {
            return index;
        }
    }).filter(isFinite);

    listToDo.splice(indexes,1);
};

exports.checksToList = function(id){
    var indexes = listToDo.map(function(obj, index) {
        if(obj.id == id) {
            return index;
        }
    }).filter(isFinite);

    console.log(listToDo[indexes].title);

};
