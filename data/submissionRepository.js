var submissionModel = require('../models/submission').model;

exports.getAll = function(callback){
  submissionModel.find().exec(function(err, data){
    if(err){
      console.log(err);
      callback("An error has occurred", data);
      return;
    }
    callback(null, data);
  });
}

exports.create = function(model, callback){
  submissionModel.create(model, function(err){
    if(err){
      console.log(err);
      callback("An error has occurred");
      return;
    }

    callback();
  });
}
