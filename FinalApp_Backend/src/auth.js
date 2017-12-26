const md5 = require('md5')
const User = require('./model.js').User
const Profile = require('./model.js').Profile
const Article = require('./model.js').Article
const Comment = require('./model.js').Comment
const findByUsernameInUser = require('./model.js').findByUsernameInUser
const findByUsernameInProfile = require('./model.js').findByUsernameInProfile

const FacebookStrategy = require('passport-facebook').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')


const cookieKey = 'sid';
let sessionUser = {};
const mySecretMessage = "my secret message for salting: spurs";

exports.cookieKey = cookieKey;
exports.sessionUser = sessionUser;

const isLoggedIn = (req, res, next) => {
	console.log(req.cookies);
	if (req.isAuthenticated()) {
		req.username = req.user.username
		next()
		return
	}
	if(!req.cookies){
		res.status(401).send('Not authorized! No cookie!')
		return
	}
	let sid = req.cookies[cookieKey]
	if(!sid){
		res.status(401).send('Not authorized! No cookie with sid!')
		return
	}
	let userObject = sessionUser[sid];
	if(userObject && userObject.username){
		req.username = userObject.username;
		next();
	}
	else{
		res.status(401).send('Not authorized! Invalid cookie!')
	}
}



const loginAction = (req,res)=>{
	const username = req.body.username;
	const password = req.body.password;
	if(!username || !password){
		res.status(400).send({result:"Invalid input!"});
		return;
	}
	findByUsernameInUser(username, (items)=>{
		if(items.length===0){
			res.status(401).send({result:"No such user exist!"})
			return;
		}
		else{
			const salt = items[0].salt; 
			const hash = items[0].hash;
			if(md5(password+salt)!=hash){
				res.status(401).send({result:"Wrong password!"})
				return;
			}
			else{
				const sessionKey = md5(mySecretMessage + new Date().getTime() + items[0].username);
				sessionUser[sessionKey] = items[0]
				res.cookie(cookieKey, sessionKey, {maxAge:3600*1000, httpOnly:true})
				res.status(200).send({username:username, result:'success'});
				return;
			}
		}
	})
}

const logoutAction = (req, res)=>{
	if (req.isAuthenticated()) {
		req.session.destroy()
		req.logout()
		res.status(200).send("OK")
	}else{
		delete sessionUser[req.cookies[cookieKey]];
		res.clearCookie(cookieKey);
		res.status(200).send('Logout Succeed!')
	}
	
}

const registerAction = (req, res)=>{
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const dob = req.body.dob;
	const zipcode = req.body.zipcode;
	if(!username || !password || !email || !dob || !zipcode){
		res.status(400).send({result:"Invalid input!"});
		return;
	}
	findByUsernameInUser(username, function(items){
		if(items.length !== 0){ 
			res.status(400).send({result:"User already exist!"})
			return;
		}
		else{
			const mySalt = "this is a random salt" + Math.random().toString();
			new User({username:username, salt:mySalt, hash: md5(password+mySalt)}).save(()=>{
				User.findOne({username}, (err, item) => {
					if(err){
						res.status(400).send({error: err})
					}else{
						if(item && item.length != 0){
							new Profile({username:username, email: email, zipcode: zipcode, dob: dob, headline:"Default headline!",
								avatar:'https://cdn2.iconfinder.com/data/icons/poke-ball-set-free/150/Sports_Ball-128.png',
								following: ["Follower"], userid: item._id}).save(()=>{
									res.status(200).send({username: username ,result:"Success! Try to login!"});
									return;
								});		
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
				
			});
		}
	});
}

const putPassword = (req, res)=>{
	const password = req.body.password;
	const username = req.username;
	if(!password){
		res.status(400).send({result:"Invalid input!"});
	}
	const newSalt = "this is a random salt" + Math.random().toString();
	User.findOneAndUpdate({username}, {salt:newSalt, hash: md5(password+newSalt)},{new:true}, (err,item)=>{
		if(err){
			res.status(400).send({error:err})
		}
		else{
			if(item){
				delete sessionUser[req.cookies[cookieKey]];
				let newCookie = md5(item.hash+item.salt);
				sessionUser[newCookie] = item;
				res.cookie(cookieKey, newCookie, {maxAge:3600*1000, httpOnly:true})
				res.status(200).send({username, status: 'Password changed!'})
			}
			else{
				res.status(404).send({result:'No matched items!'})
			}
		}
	})
}

// Facebook login part
const users = []
let hostUrl = '';
const callbackURL = 'https://finalappbackend.herokuapp.com' + '/auth/facebook/callback'
const facebookConfig = {
	clientID: '859666037535063',
	clientSecret: '47b008cb1b816abb6fae02c717b96893',
	callbackURL: callbackURL,
	passReqToCallback: true
}

passport.serializeUser(function (user, done) {
	done(null, user.id)
})

passport.deserializeUser(function (id, done) {
	User.findOne({ authId: id }).exec(function (err, user) {
		done(null, user)
	})
})

passport.use(new FacebookStrategy(facebookConfig,
	function (req, token, refreshToken, profile, done) {
		process.nextTick(function() {
		const sid = req.cookies[cookieKey]
		const username = profile.displayName + '@facebook'
		if (!sid) {
			let username = profile.displayName + '@facebook'
			findByUsernameInUser(username, (items) => {
				// New facebook user
				if (items.length === 0) {
					new User({
						username: username,
						salt: null,
						hash: null,
						auth: { facebook : username }, //auth field to indenity user comes from FB
						authId: profile.id
					}).save(() => {
						new Profile({
							username: username,
							email: 'sample@rice.edu',
							zipcode: 77025,
							dob: '01/01/1994',
							headline: "Default headline for facebook user",
							avatar: 'https://www.facebook.com/images/fb_icon_325x325.png',
							following: ['Follower']
						}).save()
					});
				}
				return done(null, profile)
			})
		}
		else {
				const localUser = sessionUser[sid].username;
				Profile.findOne({ username: username }).exec(function (data, err) {
					if (data) {
						const old_followers = data.following
						Profile.findOne({ username: localUser }).exec(function (newProfil, err) {
							if (newProfile) {
								//merge the follower
								const newFollowersList = newProfile.following.concat(old_followers)
								Profile.update({ username: localUser },
									{ $set: { 'following': newFollowersList } },
									function () { })
							}
						})
						//clear the data in the facebook account
						Profile.update({ username: username },
							{ $set: { 'following': [] } },
							function () { })
					}
				})
				Article.update({ author: username },
					{ $set: { 'author': localUser } },
					{ new: true, multi: true }, function () { })
				Article.update({ 'comments.author': username },
					{ $set: { 'comments.$.author': localUser } },
					{ new: true, multi: true },
					function () { })
				User.findOne({ username: localUser }).exec(function (user, err) {
					if (user) {
						let authObj = {}
						authObj[`${profile.provider}`] = profile.displayName
						User.update({ username: localUser },
							{ $addToSet: { 'auth': authObj } },
							{ new: true },
							function () { })
					}
				})
				return done(null, profile)
			}
		})		
	})
)

// Connect to FB account with normal account
const linkAccount = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const theusername = req.username;
	findByUsernameInUser(theusername, (datas) => {
		const thesalt = datas[0].salt;
		const thehash = datas[0].hash;
		if(thesalt || thehash){
			res.status(401).send({result:"The link request must be sent by a thirdy party user!"})
			return;
		}
	})
	if (!username || !password) {
		res.status(400).send({result:"Invalid input!"})
		return
	}
	findByUsernameInUser(username, (items)=>{
		if(items.length===0){
			res.status(401).send({result:"No such user exist!"})
			return;
		}
		const salt = items[0].salt;
		const hash = items[0].hash;
		let auth = items[0].auth;
		if(auth && Object.keys(auth).length != 0){
			res.status(401).send({result:"This user already linked"})
			return;
		}
		if(!salt || !hash){
			res.status(401).send({result:"The link user must be a normal user!"})
			return;
		}
		if (md5(password + salt) === hash) {
			Article.update({ author: req.username },
				{ $set: { 'author': username } },
				{ new: true, multi: true },
				function () { })
			Article.update({ 'comments.author': req.username },
				{ $set: { 'comments.$.author': username } },
				{ new: true, multi: true }, function () { })
			Profile.findOne({ username: req.username }).exec(function (profile, err) {
				if (profile) {
					const old_followers = profile.following
					Profile.findOne({ username: username }).exec(function (newProfile, err) {
						if (newProfile) {
							const newFollowersList = newProfile.following.concat(old_followers)
							Profile.update({ username: username },
								{ $set: { 'following': newFollowersList } },
								function () { })
						}
					})
					//Delete the profile record
					Profile.update({ username: req.username }, {
						$set: {
							'headline': "Linked with normal account now, login from normal account to check",
							'following': [],
							'email': null,
							'zipcode': null,
							'dob': "01/01/1994",
							'avatar': "https://www.facebook.com/images/fb_icon_325x325.png"
						}
					}, function () { })
				}
			})
			User.findOne({ username: username }).exec(function (err, user) {
				if (user) {
					let authObj = { facebook : username };
					User.update({ username: username },
						{ $addToSet: { 'auth': authObj } },
						{ new: true }, function () { })
				}
			})
			res.status(200).send({ username: username, result: 'success' })
		} else {
			res.status(401).send({result: "incorrect password!"})
		}
	})
}

// Disconnect FB account and update the FB account to empty
const unlinkAccount = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		res.status(400).send({result:"Invalid input!"})
		return
	}
	findByUsernameInUser(username, (items)=>{
		if(items.length===0){
			res.status(401).send({result:"No such user exist!"})
			return;
		}
		const salt = items[0].salt;
		const hash = items[0].hash;
		let auth = items[0].auth;
		if(!auth || Object.keys(auth).length == 0){
			res.status(401).send({result:"This user is not linked"})
			return;
		}
		if (md5(password + salt) === hash) {
			User.update({ username: username },
			{ $set: { auth: {} } },
			{ new: true }, function () {
				res.status(200).send({ result: 'successfully unlink' })
			})	
		}
		else{
			res.status(401).send({result: "incorrect password!"})
		}
	})
}

function facebookLogin(req, res) {
	res.redirect(hostUrl)
}

function fail(req, res) {
	res.send('fail:', req.user)
}

const location_res = (req, res, next) => {
	if (hostUrl === '') {
		hostUrl = req.headers.referer
	}
	next()
}

const success_res = (req, res) => {
	req.session.save(() => {
		res.redirect(hostUrl+"/#/main")
	})
}

const error_res = (err, req, res, next) => {
	if (err) {
		res.status(400);
		res.send({ err: err.message });
	}
}

const redirects = {
  successRedirect: 'http://ry13finalapptest.surge.sh/#/main',
  failureRedirect: '/fail'
};

module.exports = app => {
	app.use(cookieParser())
	app.use(location_res)
	app.use(session({ secret: 'myScrectKey', resave: true, saveUninitialized: true }))
	app.use(passport.initialize())
	app.use(passport.session())

	app.use('/login/facebook', passport.authenticate('facebook', { scope: 'email' }))
	app.use('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/fail' }), success_res)
	app.use('/fail', fail)
    app.post('/login', loginAction)
    app.post('/register', registerAction)
    app.use(isLoggedIn)
	app.post('/linkAccount', linkAccount)
	app.post('/unlinkAccount', unlinkAccount)
    app.put('/logout', logoutAction)
    app.put('/password', putPassword)
}