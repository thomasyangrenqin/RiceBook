// this is model.js 
const mongoose = require('mongoose')
require('./db.js')

const commentSchema = new mongoose.Schema({
	author: String, date: Date, text: String
})

commentSchema.virtual('commentId').get(function(){
    return this._id;
});

// Ensure virtual fields are serialised.
commentSchema.set('toJSON', {
    virtuals: true
});

const articleSchema = new mongoose.Schema({
	author: String, img: String, date: Date, text: String,
	comments: [ commentSchema ]
})

var userSchema = new mongoose.Schema({
	username:String, salt:String, hash:String, auth: Object, authId:String
})

const profileSchema = new mongoose.Schema({
	username: String, displayname: String, email: String, zipcode: String, 
	dob: Date, headline: String, avatar: String, following: [String], userid: String
})

const user = mongoose.model('user', userSchema)
exports.User = user

const profile = mongoose.model('profile', profileSchema)
exports.Profile = profile

const article = mongoose.model('article', articleSchema)
exports.Article = article


exports.findByUsernameInUser = (username, callback) => {
	user.find({ username }).exec(function (err, items) {
		callback(items)
	})
}


exports.findByUsernameInProfile = (username, callback) => {
	profile.find({ username }).exec(function (err, items) {
		callback(items)
	})
}