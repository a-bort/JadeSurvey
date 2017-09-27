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

exports.get = function(id, callback){
  submissionModel.findById(id, function(err, data){
    if(err){
      console.log(err);
      callback("An error has occurred", data);
      return;
    }
    if(!data){
      console.log("Id not found");
      callback("Id not found", data);
      return;
    }
    callback(null, data);
  });
}

exports.create = function(model, callback){
  model.created = new Date();
  submissionModel.create(model, function(err){
    if(err){
      console.log(err);
      callback("An error has occurred");
      return;
    }

    callback();
  });
}
