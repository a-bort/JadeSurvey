
/*
 * GET home page.
 */
var submissionRepository = require("./data/submissionRepository");
var auth = require('basic-auth');
var config = require('./config/config')

module.exports = function(app){

  app.get('/index', function(req, res){
    res.render('index');
  });

  app.get('/results', requireAuth, function(req, res){
    res.render('results');
  });

  app.post('/submit', function(req, res){
    var body = req.body;
    if(!(body instanceof Array)){
      send400(res);
      return;
    }
    var model = {questions: body};
    submissionRepository.create(model, function(err){
      defaultJson(res, err);
    });
  });

  app.get('*',function (req, res) {
      res.redirect('/index');
  });
};

function requireAuth(req, res, next){
  var credentials = auth(req);
  if(!credentials
    || credentials.name !== config.adminUser
    || credentials.pass !== config.adminPass){
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="jade"')
      res.end('Access denied')
  } else {
    next();
  }
}

function defaultJson(res, err){
  if(res){
    if(err){
      res.json({error: err});
    } else{
      res.json({success: true});
    }
  }
}

function send400(res){
  res.status(400);
  res.send({error: 'Validation Error'});
}
