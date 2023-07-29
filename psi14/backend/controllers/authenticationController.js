var User = require('../models/user');


// Display detail page for a specific hero.
exports.authentication = function (req, res, next) {
    User.findOne({name: req.body.user.name}, function (err, user) {
        if (err || user == null) {
            next(err);
            return;
        }
        if (req.body.user?.password !== user?.password) {
            next(err);
            return;
        }

        res.json({name: user.name, role: user.role, _id: user._id});
    });
};
