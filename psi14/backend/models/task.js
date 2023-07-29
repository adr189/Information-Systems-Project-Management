var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema(
    {
        name: {type: String, required: true},
        priority: {type: String, required: true},
        percentage: {type: Number, required: true},
        begin_date: {type: Date},
        end_date: {type: Date},
        project: {type: Schema.ObjectId, ref: 'Project'},
        assignedUsers: [{type: Schema.ObjectId, ref: 'User'}]
    }
)

TaskSchema
.virtual('url')
.get(function () {
    return '/task/' + this._id;
});

module.exports = mongoose.model('Task', TaskSchema);