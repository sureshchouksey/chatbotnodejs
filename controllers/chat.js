

let Chat = require('../models/chatBot');

var log4js = require('log4js'); // include log4js
//require('fs').mkdirSync('./log');
var logConfig = require('../config/log4js');

log4js.configure({ 
  appenders: {
    out: { type: 'console' }, 
    task: { type: 'dateFile', filename: 'logs/task',"pattern":".log", alwaysIncludePattern:true }, 
    result: { type: 'dateFile', filename: 'logs/result',"pattern":".log", alwaysIncludePattern:true}, 
    error: { type: 'dateFile', filename: 'logs/error', "pattern":".log",alwaysIncludePattern:true}, 
    default: { type: 'dateFile', filename: 'logs/default', "pattern":".log",alwaysIncludePattern:true}, 
    rate: { type: 'dateFile', filename: 'logs/rate', "pattern":".log",alwaysIncludePattern:true} 
  },
  categories: {
    default: { appenders: ['out','default'], level: 'info' },
    task: { appenders: ['task'], level: 'info'},
    result: { appenders: ['result'], level: 'info' },
    error: { appenders: ['error'], level: 'error' },
    rate: { appenders: ['rate'], level: 'info' }
  }
});


var loggerinfo = log4js.getLogger('info'); // initialize the var to use.
var loggererror = log4js.getLogger('error'); // initialize the var to use.
var loggerdebug = log4js.getLogger('debug'); // initialize the var to use.
if(logConfig.visible){
    loggerinfo.level = "OFF";
    loggererror.level = "OFF";
    loggerdebug.level = "OFF";    
}

var keyword_extractor = require("keyword-extractor");
 
//  Opening sentence to NY Times Article at
//  http://www.nytimes.com/2013/09/10/world/middleeast/surprise-russian-proposal-catches-obama-between-putin-and-house-republicans.html
var sentence = "where is the my library";
// Get all
exports.home = (req, res) => {  
 res.send('Welcome to server');
}

exports.getAll = (req, res) => {
    
  var extraction_result = keyword_extractor.extract(req.body.question,{
                        language:"english",
                        remove_digits: true,
                        return_changed_case:true,
                        remove_duplicates: true

                    });
    //res.send(extraction_result);
    console.log(extraction_result);
    Chat.find({ words: { $all: extraction_result } }, (err, docs) => {
    if (err) { return loggererror.info(err); }
    loggerinfo.info("Search result of getAll Service", docs);
    if(docs.length>=1){
      res.json({Answer:docs[0].content});
    }
    else{
      res.send('data is not available');
    }
  });  
}

exports.getAllChat = (req, res) => {  
  Chat.find({}, (err, docs) => {
    if (err) { return loggererror.info(err); }
    loggerinfo.info("Search result of getAll Service", docs);
    res.json(docs);
  });
}

exports.index = (req, res) => {  
  res.sendFile( __dirname + "/" + "index.html" );
}

// Count all
exports.count = (req, res) => {
  Chat.count((err, count) => {
    if (err) { return loggererror.info(err); }
    res.json(count);
  });
}

// Insert
exports.insert = (req, res) => {
   //loggerinfo.info('Request body of Registration Service',req.body);
  var chatData = {
	"contentId":"5",
	"contentType":"Text",
	"contentLevel":"Public",
	"content":"The library is close Daily on 6:00 PM.",
	"domain":"Library",
	"words":["when","library","close"],
	"testPhrase":"When is the library close ?"
}
  var obj = new Chat(chatData);
  obj.save((err, item) => {
    // 11000 is the code for duplicate key error
    console.log(err,item);
    if (err && err.code === 11000) {
      res.sendStatus(400);
    }
    if (err) {
      return loggererror.info(err);
    }
    res.status(200).json(item);
  });
}

exports.insertMany = (req, res) => {
   //loggerinfo.info('Request body of Registration Service',req.body);
  var chatData = [{
	"contentId":"0",
	"contentType":"Link",
	"contentLevel":"Public",
	"content":"HTTP://EXAMPLE.COM",
	"domain":"Library",
	"words":["where","library"],
	"testPhrase":"Where is the Library?"
},{
	"contentId":"1",
	"contentType":"Link",
	"contentLevel":"Public",
	"content":"HTTP://EXAMPLE2.COM",
	"domain":"Library",
	"words":["how","library"],
	"testPhrase":"How to check out a library book?"
},{
	"contentId":"2",
	"contentType":"Link",
	"contentLevel":"Public",
	"content":"The library is open Daily from 8:00 AM to 18:00 AM",
	"domain":"Library",
	"words":["when","library"],
	"testPhrase":"When is the library open ?"
},{
	"contentId":"3",
	"contentType":"Link",
	"contentLevel":"Public",
	"content":"The HR dept is located on the third floor of the main building. Room C36",
	"domain":"locations",
	"words":["where","human resources","hr"],
	"testPhrase":"Where is the HR department?"
},{
	"contentId":"4",
	"contentType":"Text",
	"contentLevel":"Public",
	"content":"The library is open Daily from 8:00 AM.",
	"domain":"Library",
	"words":["when","library","open"],
	"testPhrase":"When is the library open ?"
},{
	"contentId":"5",
	"contentType":"Text",
	"contentLevel":"Public",
	"content":"The library is close Daily on 6:00 PM.",
	"domain":"Library",
	"words":["when","library","close"],
	"testPhrase":"When is the library close ?"
}]
      Chat.collection.insert(chatData, function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });
}
exports.readLogFile = (req,res)=>{
  let stream = fs.createReadStream(__dirname + '/my.log')
  , log = new Log('debug', stream);
  log.on('line', function(line){
    res.send(line);
  });
}


