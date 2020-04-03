var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , add_v1 = require('./routes/add_v1')

var elasticsearch = require('@elastic/elasticsearch');
elasticClient = new elasticsearch.Client({
    node: 'http://localhost:9200',
    log: 'info'
});

global = {
  //base64: require('urlsafe-base64'),
  uri: require('URIjs'),
  //common: require('./lib/common'),
  url_classifier: require('./lib/url_classifier'),
}

var app = express();
//var router = express.Router();
//app.use('/bookmarks', router);
  //var methodoverride = require('method-override');
  var cookieparser = require('cookie-parser');
  var session = require('express-session');
  var bodyparser = require('body-parser')
  //var morgan = require('morgan')

  app.set('port', process.env.PORT || 8125);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view options', { layout: false });
//var favicon = require('serve-favicon');
//  app.use(favicon(__dirname));
  //app.use(morgan('combined'))
  app.use(bodyparser.json({
    extended: true,
  }));
  app.use(bodyparser.urlencoded({
    extended: true,
  }));
  //app.use(methodoverride());
  app.use(cookieparser('your secret here'));
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, '/include')));
  app.use(express.static(path.join(__dirname, '/files')));
  //app.use(app.router);

//app.configure('development', function(){
var errorhandler = require('errorhandler')
  app.use(errorhandler());
//});

app.get('/', routes.index);
app.post('/add', add_v1.add);

http.createServer(app).listen(app.get('port'), 'localhost', function(){
  console.log("Express server listening on port " + app.get('port'));
});

