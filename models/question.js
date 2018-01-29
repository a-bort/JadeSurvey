var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
  question: String,
  name: String,
  answers: [String],
  otherValue: String,
  na: Boolean
});

exports.model = mongoose.model('Question', questionSchema);
exports.schema = questionSchema;
