var mongoose = require('mongoose');
var question = require('./question');

var submissionSchema = mongoose.Schema({
  questions: [question.schema],
  created: { type: Date },
  unread: { type: Boolean, default: true }
});

exports.schema = submissionSchema
exports.model = mongoose.model('Submission', submissionSchema);
