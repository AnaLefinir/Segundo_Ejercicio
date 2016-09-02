/**
 * Created by Anita on 24/08/2016.
 */
var express = require('express'),
    pug = require('pug'),
    toDo = require('./todos.js'),
    bodyParser = require('body-parser');

var app = express();

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'pug');


app.get('/task', function (req, res) {
    var task = toDo.list();
    res.type('text/html');
    res.render('indexJade', {task: task});
});

app.post('/actions/add/', function (req, res) {
    if (req.body.title && req.body.description) {
        toDo.addToList(req.body);
    }
    res.redirect('/task');
});

app.get('/actions/delete/:id', function (req, res) {
    if (req.params.id) {
        toDo.deleteToList(req.params.id);
    }
    res.redirect('/task');
});

app.get('/', function (req, res) {
    res.redirect('/task');
});

app.listen(8080, function () {
    console.log('Express server listening on port 8080');
});