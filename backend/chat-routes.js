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

var Knights = {
  names: {
  Sir: [
  'Nevsky',
  'Brertrand',
  'Edward',
  'Henry',
  'Godfrey',
  'Arthur',
  'William',
  'Walter'
   ],
  Lady : [
    'Joan',
    'BreeAnne',
    'Elowin',
    'Jane',
    'Katherine',
    'Catalina',
    'Christine',
    'Heloise'
    ],
  },
  locations: [
    'Germany',
    'Netherlands',
    'France',
    'England',
    'Tarth',
    'Spain',
    'Italy',
    'Scotland',
    'Ottoman',
    'Bulgaria',
    'Poland',
    ]
};



router.get('/hello', function(req, res) {
  res.json({ message: 'hooray! welcome to the chat!' }); 
  console.log(Knights);
});


router.post('/chat', function(req, res) {
    var Chat = require('./models/chat');
  //create new chat
  var chat = new Chat ({
    Name: req.name,
    Active: true,
    Creator: req.creator,
  });

  chat.save(function(err){
    if(err)
        res.send(err);

    res.json({message: 'new chatroom'});
  });
  
});

router.get('/chatrooms', function(req, res) {
  var chat = require('./models/chat');
  chat.find({}, function(err, rooms){
    var list = {};
    rooms.forEach(function(room){
      if(room.Active){
        list[room._id]= room;
      }
    });
  });

  res.send(list);

});


router.post('/join', function(req, res) {
  var Chat = require('./models/chat');
  //append chatroom to include user
  Chat.finddByIdAndUpdate(req._id,{"$push": {"Users": req.user._id }},
      function(err, raw) {
       if (err) return handleError(err);
       console.log('The raw response from Mongo was ', raw);
      }
    );
  
});