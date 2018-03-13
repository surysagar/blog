var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
// var tokenManager = require('./config/token_manager');
var secret = require('.api/config/secret');
var path = require('path');
var cors = require('cors');
//var redis = require('redis');
//var client = redis.createClient();

// client.on('connect', function() {
//	console.log('connected to redis');
//})
var port = process.env.PORT || 3000;
app.listen(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan());
app.use(cors());

app.use(express.static(path.join(__dirname, '../app')));
//app.use(cors());
app.disable('etag');
//Routes
var routes = {};

routes.posts = require('.api/route/posts.js');
routes.users = require('.api/route/users.js');
routes.rss = require('.api/route/rss.js');


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

//Get all published post
app.get('/post', routes.posts.list);

//Get all posts
app.get('/post/all', routes.posts.listAll);

//Get the post id
app.get('/post/:id', routes.posts.read); 

//Like the post id
app.post('/post/like', routes.posts.like);

//Unlike the post id
app.post('/post/unlike', routes.posts.unlike);

//Get posts by tag
app.get('/tag/:tagName', routes.posts.listByTag); 

//Create a new user
app.post('/user/register', routes.users.register); 

//Login
app.post('/user/signin', routes.users.signin); 

//Logout
app.get('/user/logout', routes.users.logout); 

//Create a new post
app.post('/post', routes.posts.create); 

//Edit the post id
app.put('/post', routes.posts.update); 

//Delete the post id
app.delete('/post/:id', routes.posts.delete); 

//Serve the rss feed
app.get('/rss', routes.rss.index);

console.log('Blog API is starting on port 3000');