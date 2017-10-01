var mongoose = require('mongoose');
var question = require('./question');

var submissionSchema = mongoose.Schema({
  questions: [question.schema],
  created: { type: Date },
  reviewed: { type: Boolean, default: false }
});

exports.schema = submissionSchema
exports.model = mongoose.model('Submission', submissionSchema);
