var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
	contentType: { type: String, required: true },
	contentLevel: { type: String, required: true },
	content: { type: String, required: true },
	domain: { type: String, required: true },
	contentId: { type: Number},
	words:[{type:String}],
	testPhrase:{type:String},
});

// Sets the createdAt parameter equal to the current time
chatSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);