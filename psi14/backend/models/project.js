var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: {type: String, required:true, minlength:4},
    acronym: {type: String, required:true, length:3},
    begin_date: {type: Date, required:true},
    end_date: {type: Date},
    team: {type: Schema.ObjectId, ref: 'Team'},
});

ProjectSchema.virtual('url').get(function() {
    return '/project/' + this.name;
});

module.exports = mongoose.model('Project', ProjectSchema);