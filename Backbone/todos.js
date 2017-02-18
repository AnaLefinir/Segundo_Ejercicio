/**
 * Created by Anita on 26/08/2016.
 */
var _ = require('lodash');

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

exports.list = function(){
    return (listToDo);
};

exports.addToList = function (infoTask) {
    var maxId = _.maxBy(listToDo, function (item) { return item.id });
    var newTodoItem = { "id": (maxId ? maxId.id : 0) + 1, "title": infoTask.title, "description": infoTask.description, "done": false };
    listToDo.push(newTodoItem);

    return newTodoItem;
};

exports.deleteToList = function (id){
    listToDo.splice(_.findIndex(listToDo, function(obj) { return obj.id == id }),1);
};

exports.doneTask = function (id, done){
    var task =_.find(listToDo, function(obj) { return obj.id == id });
    if(done === 'false'){
        task.done = false;
    }else{
        task.done = true;
    }
};
