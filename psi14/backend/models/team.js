var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema(
    {
        name: {type: String, required: true},
        project: {type: String},
        users: {type: [Schema.ObjectId], ref: 'User', required: false},
    }
);


TeamSchema
    .virtual('url')
    .get(function () {
        return '/team/' + this._id;
    });

//Export model
module.exports = mongoose.model('Team', TeamSchema);
