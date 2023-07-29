var User = require('../models/user');
const Team = require("../models/team");
const {body, validationResult} = require('express-validator');


exports.user_create = [
    body('name').trim().isLength({min: 3}).escape().withMessage('Nome: pelo menos 3 caracteres')
        .isAlphanumeric().withMessage('Nome: apenas caracteres alfanumérico'),
    body('password').trim().isLength({min: 8}).escape().withMessage('Senha: pelo menos 8 caracteres'),
    (req, res, next) => {
        User.findOne({'name': req.body.name}, function (err, existingUser) {
            if (err) {
                return handleError(err);
            }

            // Erro - Nome de user existente.
            if (existingUser) {
                res.status(406).send("User já existe");
                return;
            }

            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send({errors: errors.array()});
            } else {
                var new_user = new User({
                    name: req.body.name,
                    password: req.body.password,
                    role: req.body.role
                });

                new_user.save(function (err) {
                    if (err) {
                        return handlerError(err);
                    } else {
                        res.json(new_user);
                    }
                });
            }
        });
    }
];


// Display list of all users.
exports.users_list = function (req, res, next) {
    let filters = req.query;

    if (req.query.name == null || req.query.name === "all") {
        User.find({'role': 'REGULAR'}).exec(function (err, users_list) {
            if (err) {
                return handleError(err);
            }
            return res.json(users_list);
        });

    } else {
        User.find({"name": {"$regex": req.query.name, "$options": "i"}}, function (err, list_users) {
            if (err) {
                return next(err);
            }

            return res.send(list_users);
        });
    }
};

exports.get_meetings = [
    (req, res, next) => {

        User.findById(req.params.id).exec(function (err, user) {
            if (err) {
               return  next(err);
            }
            return res.send(user.meetings);
        });
    }
];

exports.add_meeting = [
    (req, res, next) => {

        User.findByIdAndUpdate(req.body.user, {$addToSet: {meetings: req.body.newMeeting}}, {new: true})
            .then((result) => {
                    res.send(result);
                }
            )
    }
];


// Display detail page for a specific user.
exports.user_detail = function (req, res, next) {
    User.findById(req.params.id)
        .exec(function (err, user) {
            if (err) {
                res.json({error: "user not found"});
                return;
            }
            res.json(user);
        });
};

exports.exists_user_with_name =
    async function (req, res, next) {
        const userExists = await User.findOne({name: req.query.name}).select("name").lean();
        if (userExists) {
            res.send(true);
        } else {
            res.send(false);
        }
    };


