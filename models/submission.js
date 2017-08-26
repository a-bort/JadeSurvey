var mongoose = require('mongoose');
var question = require('./question');

var submissionSchema = mongoose.Schema({
  questions: [question.schema]
});

exports.schema = submissionSchema
exports.model = mongoose.model('Submission', submissionSchema);
