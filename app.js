/**
 * Created by Anita on 24/08/2016.
 */
var express = require('express'),
    ejs = require('ejs'),
    toDo = require('./todos.js'),
    bodyParser = require('body-parser');

var app = express();

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');


app.get('/task', function (req, res) {
    var task = toDo.list();
    res.type('text/html');
    res.render('index', {task: task});
});

app.post('/actions/add/', function (req, res) {
    if ((req.body.title && req.body.description) != '') {
        toDo.addToList(req.body);
    }
    res.redirect('/task');
});

app.get('/actions/delete/:id', function (req, res) {
    if (req.params.id != '') {
        toDo.deleteToList(req.params.id);
    }
    res.redirect('/task');
});

app.get('/actions/checks/:id', function (req, res) {

    if (req.params.id != '') {
        //toDo.checksToList(req.params.id);
        console.log(req.params.id);
    }
    res.redirect('/task');
});

app.listen(8080, function () {
    console.log('Express server listening on port 8080');
});