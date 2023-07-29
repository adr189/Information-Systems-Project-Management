var userArgs = process.argv.slice(2);


var async = require('async')

var Task = require('./models/task');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tasks = []

function taskCreate(name, project) {
    taskdetail = {
        name: name
    }

    if (project != false) taskdetail.projectId = {name: project.name}

    var task = new Task(taskdetail);
    task.save(function (err) {
        if (err) {
            return
        }
        tasks.push(task)
    });
}



function createTasks(cb) {
    async.parallel([
        function(callback) {
          taskCreate("Clean");
        },
        function(callback) {
          taskCreate("Work");
        },
        ]);
}