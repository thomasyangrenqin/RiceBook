var Profile = require('./model.js').Profile
var ObjectId = require('mongodb').ObjectId;

const getHeadLines = (req, res) => {
	const users = req.params.users ? req.params.users.split(','): [req.username];
	Profile.find({username:{$in:users}}).exec((err, items)=>{
		if(err){
			res.status(400).send({error:err})
		}
		else{
			if(items && items.length != 0){
				res.status(200).send({ headlines: items.map((item)=>{
					return {username:item.username, headline:item.headline}
				})})
			}
			else{
				Profile.find({userid:{$in:users}}).exec((err, items) => {
					if(err){
						res.status(400).send({error: err})
					}else{
						if(items && items.length != 0){
							res.status(200).send({ headlines: items.map((item)=>{
								return {username:item.username, headline:item.headline}
							})})
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
			}
		}
	})
}


const putHeadLines = (req, res) => {
	const username = req.username
	const headline = req.body.headline
	if(!headline){
		res.status(400).send("You do not supply headline!")
	}
	else{
		Profile.findOneAndUpdate({username},{headline},{new:true},(err,item)=>{
			if(err){
				res.status(400).send({error:err})
			}
			else{
				if(item){
					res.status(200).send({username, headline:item.headline})
				}
				else{
					res.status(404).send({result:'No matched items!'})
				}
			}
		})
	}
}


const getEmail  = (req, res) => {
	const username = req.params.user ? req.params.user: req.username
	Profile.findOne({username}, 'email').exec((err, item)=>{
		if(err){
			res.status(400).send({error:err})
		}
		else{
			if(item && item.length != 0){
				res.status(200).send({username, email:item.email})
			}
			else{
				Profile.findOne({"userid": username}, (err, item) => {
					if(err){ 
						res.status(400).send({ error: err }) 
					}else{
						if(item && item.length != 0){
							res.status(200).send({username: item.username, email:item.email})
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
			}
		}
	})
}


const putEmail = (req, res) => {
	const username = req.username
	const email = req.body.email
	if(!email){
		res.status(400).send("You do not supply email!")
	}
	else{
		Profile.findOneAndUpdate({username},{email},{new:true},(err,item)=>{
			if(err){
				res.status(400).send({error:err})
			}
			else{
				if(item){
					res.status(200).send({username, email:item.email})
				}
				else{
					res.status(404).send({result:'No matched items!'})
				}
			}
		})
	}
}


const getZipcode = (req, res) => {
	const username = req.params.user ? req.params.user: req.username
	Profile.findOne({username}, 'zipcode').exec((err, item)=>{
		if(err){
			res.status(400).send({error:err})
		}
		else{
			if(item){
				res.status(200).send({username, zipcode:item.zipcode})
			}
			else{
				Profile.findOne({"userid": username}, (err, item) => {
					if(err){ 
						res.status(400).send({ error: err }) 
					}else{
						if(item && item.length != 0){
							res.status(200).send({username: item.username, zipcode:item.zipcode})
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
			}
		}
	})
}


const putZipcode = (req, res) => {
	const username = req.username
	const zipcode = req.body.zipcode
	if(!zipcode){
		res.status(400).send("You do not supply zipcode!")
	}
	else{
		Profile.findOneAndUpdate({username},{zipcode},{new:true},(err,item)=>{
			if(err){
				res.status(400).send({error:err})
			}
			else{
				if(item && item.length != 0){
					res.status(200).send({username, zipcode:item.zipcode})
				}
				else{
					if(item){
						res.status(200).send({username, email:item.email})
					}
					else{
						res.status(404).send({result:'No matched items!'})
					}
				}
			}
		})
	}
}


const getAvatar = (req, res) => {
	const users = req.params.user ? req.params.user.split(','): [req.username];
	Profile.find({username:{$in:users}}).exec((err, items)=>{
		if(err){
			res.status(404).send({error:err})
		}
		else{
			if(items && items.length != 0){
				res.status(200).send({ avatars: items.map((item)=>{
					return {username:item.username, avatar:item.avatar}
				})})
			}
			else{
				Profile.find({userid:{$in:users}}).exec((err, items) => {
					if(err){
						res.status(400).send({error: err})
					}else{
						if(items && items.length != 0){
							res.status(200).send({ avatars: items.map((item)=>{
								return {username:item.username, avatar:item.avatar}
							})})
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
			}
		}
	})
}


const uploadImage = require('./uploadCloudinary')

const putAvatar = (req, res) => {
	const username = req.username
	const avatar = req.fileurl
	if(!avatar){
		res.status(400).send("You do not supply avatar!")
	}
	else{
		Profile.findOneAndUpdate({username},{avatar},{new:true},(err,item)=>{
			if(err){
				res.status(404).send({error:err})
			}
			else{
				if(item){
					res.status(200).send({username, avatar:item.avatar})
				}
				else{
					res.status(404).send({result:'No matched items!'})
				}
			}
		})
	}
}

const getDob = (req, res) => {
	const username = req.username
	Profile.find({username}, 'dob').exec((err, items)=>{
		if(err){
			res.status(404).send({error:err})
		}
		else{
			if(items && items.length != 0){
				res.status(200).send({ dob: items.map((item)=>{
					return {username:item.username, dob:item.dob}
				})})
			}
			else{
				Profile.find({userid:{$in:users}}).exec((err, items) => {
					if(err){
						res.status(400).send({error: err})
					}else{
						if(items && items.length != 0){
							res.status(200).send({ dob: items.map((item)=>{
								return {username:item.username, dob:item.dob}
							})})
						}else{
							res.status(404).send({result:'No matched items!'})
						}
					}
				})
			}
		}
	})
}

const ToProfile = (req, res) => {
	const username = req.username
	res.status(200).send({username: username, result: "Go to Profile!"})
	return
}

module.exports = app => {
    app.get('/headlines/:users?',getHeadLines)
    app.put('/headline',putHeadLines)

    app.get('/email/:user?',getEmail)
    app.put('/email',putEmail)

    app.get('/zipcode/:user?',getZipcode)
    app.put('/zipcode',putZipcode)
    
    app.get('/avatars/:user?',getAvatar)
    app.put('/avatar',uploadImage('avatar'), putAvatar)

    app.get('/dob', getDob)
    app.get('/profile', ToProfile)
}