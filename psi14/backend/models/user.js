var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true},
        meetings: [{
            begin: {type: Date},
            end: {type: Date},
            users: [{type: Schema.ObjectId, ref: 'User'}],
            type: {type: String}
        }],
    }
);


UserSchema
    .virtual('url')
    .get(function () {
        return '/user/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);
