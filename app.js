
/**
 * Module dependencies.
 */

var config = require('./config/config')

  var express = require('express')
  , app = express()
  , port = process.env.PORT || config.port
  , path = require('path')
  , mongoose = require('mongoose')

  , bodyParser = require('body-parser')
  , favicon = require('serve-favicon');

//public path
app.use(express.static(path.join(__dirname, 'public')));

 //view stuff
app.use(favicon(path.join(__dirname,'public','images','favicon.png')));

var uri = config.dbUri;

var db = mongoose.connect(uri, {useMongoClient: true });

// all environments
app.use(bodyParser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

//routes
require('./routes.js')(app);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Unexpected error');
})

app.listen(port);
console.log("Listening on " + port);
