var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var chatSchema = mongoose.Schema({
	contentType: { type: String },
	contentLevel: { type: String},
	content: { type: String},
	domain: { type: String},
	//contentId: { type: Number},
	words:[{type:String}],
	testPhrase:{type:String},
});
autoIncrement.initialize(mongoose.connection);
// Sets the createdAt parameter equal to the current time
chatSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

chatSchema.plugin(autoIncrement.plugin,{model:'Chat',field:'chatId'})
module.exports = mongoose.model('Chat', chatSchema);
