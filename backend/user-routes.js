var express     = require('express'),
    _           = require('lodash'),
    config      = require('./config'),
    jwt         = require('jsonwebtoken');
    bodyParser  = require('body-parser');

var morgan = require('morgan');
    

app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var passport = require('passport');
var jwt      = require('jsonwebtoken');

var User = require('./models/user');

var router = module.exports = express.Router();

// XXX: This should be a database of users :).
var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

function getUsers (){
  router.get(function(req, res) {
    User.find(function(err, users){
        if(err) res.send(err);

        res.json(users);
        return(users);
    });
  });
}



function getUserScheme(req) {
  
  var username;
  var type;
  var userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  };
}

router.get('/hi', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});


router.post('/users', function(req, res) {
  var User = require('./models/user');
  
  var userScheme = getUserScheme(req);  


  // if (!userScheme.username || !req.body.password) {
  //   return res.status(400).send("You must send the username and the password");
  // }

  // if (_.find(users, userScheme.userSearch)) {
  //  return res.status(400).send("A user with that username already exists");
  // }

  var user = new User({
          username: userScheme.username ,
          password: req.body.password
      });
  user.save(function(err){
    if(err)
        res.send(err);

    res.json({message: 'New User'});
  });

  var profile = _.pick(req.body, 'username', 'password', 'extra');
  profile.id = _.max(users, 'id').id + 1;

  res.status(201).send({
    id_token: createToken(profile)
  });
});



router.post('/sessions/create', function(req, res) {


  var userScheme = getUserScheme(req);

  var User = require('./models/user');
  console.log(req);

  var user  = new User({
        username: userScheme.username ,
        password: req.body.password
    });

  User.getUserByUsername(req.uswername);

  res.status(201).send({
    id_token: createToken(user)
  });
});
