var Task = require('../models/task');
var User = require('../models/user');
var async = require('async');

const {body, validationResult} = require("express-validator");
const Team = require("../models/team");

// Displays list of all tasks
exports.task_list = function (req, res, next) {
    Task.find({assignedUsers: {_id: req.params.id}}, {})
        .exec(function (err, task_list) {
            if (err) {
                res.json({error: "Tasks not found"});
            } else {
                res.json(task_list);
            }
        });
};

// Creates task on POST
exports.task_create = [
    body('name').trim().isLength({min: 4}).escape().withMessage('Task name must be specified')
        .isAlphanumeric().withMessage('Task name has non-alphanumeric characters'),


    (req, res, next) => {
        const errors = validationResult(req);
        var task = new Task({
            name: req.body.name,
            priority: req.body.priority,
            assignedUsers: req.body.assignedUsers,
            percentage: req.body.percentage
        });

        if (!errors.isEmpty()) {
            res.json({error: "Error creating a team"});
        } else {
            task.save(function (err) {
                if (err) {
                    res.json({error: "Error creating a task"});
                    return;
                }
                res.json(task);
            });
        }
    }
];

// Deletes task on POST
exports.task_delete = function (req, res, next) {
    Task.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.json({error: "Error deleting a task"});
            return;
        }
        res.send();
    });
};


exports.task_update_project = async function (req, res, next) {

    Task.findByIdAndUpdate(req.params.id, {"project": req.body.project}, function (err) {
        if (err) return console.error(err);
    }).clone().then(tsk => res.json(tsk));


}

exports.task_update_percentage =

    (req, res, next) => {
        Task.findByIdAndUpdate(req.params.id, {"percentage": req.body.percentage}, function (err) {
            if (err) return console.error(err);
        }).clone().then(tsk => res.json(tsk));

    }

exports.task_update_dates_and_percentage =

    (req, res, next) => {
        Task.findByIdAndUpdate(req.params.id, {
            "percentage": req.body.percentage,
            "begin_date": req.body.begin_date,
            "end_date": req.body.end_date
        }, function (err) {
            if (err) return console.error(err);
        }).clone().then(tsk => res.json(tsk));

    }

exports.task_detail = function (req, res, next) {
    Task.findById(req.params.id)
        .exec(function (err, task) {
            if (err) {
                res.json({error: "task not found"});
                return;
            }
            res.json(task);
        });

}

exports.remove_user_task = [
    (req, res, next) => {

        if (req.body.user != null) {


            Task.findByIdAndUpdate(req.params.id, {
                $pull: {
                    assignedUsers: req.body.user._id,
                }
            }, {new: true})
                .then((result) => {
                        res.send(result);
                    }
                )
        }
    }
]


exports.update_begin_date = [
    (req, res, next) => {

        Task.findByIdAndUpdate(req.params.id, {"begin_date": req.body.begin_date}, function (err) {
            if (err) return console.error(err);
        }).clone().then(tsk => res.json(tsk));

    }
]

exports.update_end_date = [
    (req, res, next) => {

        Task.findByIdAndUpdate(req.params.id, {"end_date": req.body.end_date}, function (err) {
            if (err) return console.error(err);
        }).clone().then(tsk => res.json(tsk));

    }
]


exports.add_user_task = [

    (req, res, next) => {

        if (req.body.user != null) {

            User.findById(req.body.user._id, {}, {}, function (err, user) {
                if (err) {
                    next(err);
                }

                Task.findByIdAndUpdate(req.params.id, {$addToSet: {assignedUsers: user}}, {new: true})
                    .then((result) => {
                            res.send(result);
                        }
                    )
            });
        }
    }
];

