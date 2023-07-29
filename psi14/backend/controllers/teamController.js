var Team = require('../models/team');
var User = require('../models/user');
var Project = require('../models/project');
var async = require('async');

const {body, validationResult} = require("express-validator");
const Task = require("../models/task");

// Display detail page for a specific hero.
exports.team_detail = function (req, res, next) {
    Team.findById(req.params.id)
        .exec(function (err, team) {
            if (err) {
                res.json({error: "team not found"});
                return;
            }
            res.json(team);
        });
};

exports.remove_user_team = [
    (req, res, next) => {

        if (req.body.user != null) {


            Team.findByIdAndUpdate(req.params.id, {
                $pull: {
                    users: req.body.user._id,
                }
            }, {new: true})
                .then((result) => {
                        res.send(result);
                    }
                )
        }
    }
]


exports.add_user_team = [

    (req, res, next) => {

        if (req.body.user != null) {

            User.findById(req.body.user._id, {}, {}, function (err, user) {
                if (err) {
                    next(err);
                }

                Team.findByIdAndUpdate(req.params.id, {$addToSet: {users: user}}, {new: true})
                    .then((result) => {
                            res.send(result);
                        }
                    )
            });
        }
    }
]

// Displays list of all teams
exports.team_list = function (req, res, next) {

    if (req.query.name == null || req.query.name === "all") {

        Team.find({}, 'name')
            .exec(function (err, team_list) {
                if (err) {
                    res.json({error: "Teams not found"});

                } else {
                    res.json(team_list);
                }
            });
    } else {
        Team.find({"name": {"$regex": req.query.name, "$options": "i"}}, function (err, list_users) {
            if (err) {
                return next(err);
            }

            return res.send(list_users);
        });
    }
};

// Displays list of all teams
exports.team_list_from_user = function (req, res, next) {
        Team.find({}, 'name')
            .exec(function (err, team_list) {
                if (err) {
                    res.json({error: "Teams not found"});

                } else {
                    res.json(team_list);
                }
            });
};

// Creates team on POST
exports.team_create = [
    body('name').trim().isLength({min: 4}).escape().withMessage('Team name must be specified')
        .isAlphanumeric().withMessage('Team name has non-alphanumeric characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        var team = new Team({
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            res.json({error: "Error creating a team"});

        } else {
            team.save(function (err) {
                if (err) {
                    res.json({error: "Error creating a team"});
                    return;
                }
                res.json(team);
            });
        }
    }
];

exports.team_add_project = async function (req, res, next) {
    Team.findByIdAndUpdate(req.params.id, {"project": req.body.project}, function (err) {

        Project.findByIdAndUpdate(req.body.project, {"team": req.params.id}, function (err) {
            if (err) return console.error(err);
        })

        if (err) return console.error(err);
    }).clone().then(tsk => res.json(tsk));
}

exports.team_remove_project = async function (req, res, next) {
    Team.findByIdAndUpdate(req.params.id, {"project": null}, function (err) {

        Project.findByIdAndUpdate(req.body.project, {"team": null}, function (err) {
            if (err) return console.error(err);
        })

        if (err) return console.error(err);
    }).clone().then(tsk => res.json(tsk));
}


exports.exists_team_with_name =
    async function (req, res, next) {
        const userExists = await Team.findOne({name: req.query.name}).select("name").lean();
        if (userExists) {
            res.send(true);
        } else {
            res.send(false);
        }
    };
