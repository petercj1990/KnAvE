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

  console.log('chat', req.body);
  var users = req.body.creator;
  var chat = new Chat ({
    Name: req.body.chatroomName,
    Active: true,
    Creator: req.body.Creator,
    Users: [req.body.Creator]
  });

  chat.save(function(err){
    if(err)
        res.send(err);

    res.json({message: 'new chatroom'});
  });
  
});

router.get('/chatrooms', function(req, res) {

  var chat = require('./models/chat');


  chat.find({}, 'Name', function(err, rooms){
        if(err){
          console.log(err);
        } else{
            //console.log(rooms);
            res.send(rooms);
        }
  });

});

router.get('/chatroomsName', function(req, res) {

  var chat = require('./models/chat');
  console.log(req.body);
  var foundRoom;
  chat.find({}, 'Name', function(err, rooms){
        if(err){
          console.log(err);
        } else{
            console.log(rooms);
            console.log("lifeissad",req.body);
            for (var x = 0; x < rooms.length; x++){
                if(rooms[x].Name === req.body.Search){
                  console.log('i found the room', rooms[x]);
                  foundRoom=rooms[x];
                }
            }
            if(!foundRoom){

            }
            else{
              console.log(foundRoom);
              res.send(foundRoom);
            }
        }
  });

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