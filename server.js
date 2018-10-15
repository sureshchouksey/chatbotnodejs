var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var config = require('config'); //we load the db location from the JSON files
var port = 3000;
app.listen(port);
console.log('server is listen in 3000 port');


//db options
let options = { 
				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
mongoose.connect("mongodb://sureshchouksey:suresh123@ds127843.mlab.com:27843/chatbot", options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  
//  include the Keyword Extractor

app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})
require('./routes/chat.routes.js')(app); 

