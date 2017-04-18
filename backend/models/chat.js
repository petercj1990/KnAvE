var mongoose     		= require('mongoose');
var Schema       		= mongoose.Schema;



var ChatSchema   = new Schema({
    Users: [{ type: String}],
    ChatList: [{ type: String}],
    Name: { type: String},
    Active: {type: Boolean},
    Creator: { type: string }
});

ChatSchema.pre('save', function(next) {
    var chat = this;
    console.log('im saving');
    
});

var Chat = module.exports = mongoose.model('Chat', ChatSchema);