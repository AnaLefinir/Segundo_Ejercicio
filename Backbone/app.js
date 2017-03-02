/**
 * Created by Anita on 10/09/2016.
 */
var express = require('express'),
    toDo = require('./todos.js'),
    $ = require("jquery"),
    bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var task = toDo.list();

app.get('/api/tasks', function (req, res) {
    res.json(task);
});

app.post('/api/tasks', function (req, res) {
    var infoTask = req.body;
    console.log(infoTask);
    var newTask = toDo.addToList(infoTask);
    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', function (req, res) {
    var id = req.params.id;
    toDo.deleteToList(id);
    res.sendStatus(200);
});

app.put('/api/tasks/:id', function(req, res){
    var id = req.params.id;
    var done = req.body.done;
    toDo.doneTask(id, done);
    res.sendStatus(200);
});

app.listen(8080, function () {
    console.log('Express server listening on port 8080');
});