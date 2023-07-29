var Project = require('../models/project');
var async = require('async');

const {body, validationResult} = require('express-validator');
const Team = require("../models/team");

// Create a project with POST
exports.project_create = [

    (req, res, next) => {

        var new_project = new Project({
            name: req.body.name,
            acronym: req.body.acronym,
            begin_date: req.body.begin_date,
            end_date: req.body.end_date,
            team: req.body.team
        });

        new_project.save(function (err) {
            if (err) {
                return next(err);
            } else {
                res.send(new_project);
            }
        });
    }

];

// Display the list of projects
exports.projects_list = function (req, res) {
    Project.find().exec(function (err, projects_list) {
        if (err) {
            return handleError(err);
        }
        res.json(projects_list);
    });
}


exports.projects_list_available = function (req, res, next) {
    Project.find({team: null}).exec(function (err, projects_list) {
        if (err) {
            next(err);
        }
        res.json(projects_list);
    });
}


exports.project_get = function (req, res, next) {
    Project.findById(req.params.id)
        .then(projects => res.json(projects))
        .catch(err => res.status(404).json({sucess: false}));
}

exports.projects_list = function (req, res, next) {
    Project.find().exec(function (err, projects_list) {
        if (err) {
            next(err);
        }
        res.json(projects_list);
    });
}

exports.exists_project_with_acronym =
    async function (req, res, next) {
        const userExists = await Project.findOne({acronym: req.query.acronym}).select("acronym").lean();
        if (userExists) {
            res.send(true);
        } else {
            res.send(false);
        }
    };
