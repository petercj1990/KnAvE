var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser');
    mongoose        = require('mongoose');


//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/knave');


var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('../'));
app.use(express.static('../images'));

router = express.Router({
  caseSensitive: true
});

app.get('/', function(req, res) {
    res.render('index.html');
});

server.listen(8080, '127.0.0.1');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

app.use(require('./user-routes'));
app.use(require('./chat-routes'));

var port = process.env.PORT || 3001;

io.on('connection', function(socket) {

    socket.on('chat message', function(msg) {
      console.log("getting pinged", msg);
        io.emit('chat message', msg);
    });
});





http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

