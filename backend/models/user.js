var mongoose     		= require('mongoose');
var Schema       		= mongoose.Schema;
var bcrypt 		 	 	= require('bcrypt');
var SALT_WORK_FACTOR 	= 10;


var UserSchema   = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    type: String,
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
// UserSchema.statics.addUser = function (newUser, callback){
// 	var user = this();
// 	bcrypt.genSalt(10, function(err, salt) {
// 	    bcrypt.hash(newUser.password, salt, function(err, hash) {
// 	        newUser.password = hash;
// 	        user.password = newUser.password;
// 	        user.username = newUser.username;
// 	        user.save(callback);
// 	    });
// 	});
// };

var User = module.exports = mongoose.model('User', UserSchema);



module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}; 

