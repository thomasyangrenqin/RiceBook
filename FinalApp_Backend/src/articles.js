
const Article = require('./model.js').Article
const User = require('./model.js').User
const Profile = require('./model.js').Profile

const uploadImage = require('./uploadCloudinary')


const postArticle = (req, res) => {
	if (!req.body.text) {
		res.status(401).send("No text input!")
		return
	}
	
	new Article({author: req.username, img: req.fileurl, date: new Date().getTime(), 
		text: req.body.text, comments: [] })
		.save((err, doc, num) => {
			if (err) { res.status(400).send({ error: err }) }
			if (doc) { res.status(200).send({ "articles": [doc] }) }
			else { res.status(404).send({ result: 'No matched items!' }) }
		})
}


const getArticles = (req, res) => {
	const id = req.params.id
	//Request with id
	if (id) {
		User.find({ username: id }).exec((err, username) => {
			if (err) { res.status(400).send({ error: err }) }
			if (username.length !== 0) { getArticlesByAuthor(req, res, id) }
			else { getArticlesById(req, res, id) }
		})
	}
	//Request without id, return all articles
	else {
		Profile.findOne({ username: req.username }, 'following').exec((err, item) => {
			if (err) { res.status(400).send({ error: err }) }
			else {
				if (item) {
					let users = [req.username, ...item.following]
					getArticlesByAuthors(req, res, users)
				}
				else { res.status(404).send({ result: 'No matched items!' }) }
			}
		})
	}
}

const getArticlesByAuthor = (req, res, username) => {
	Article.find({ author: username }).exec((err, items) => {
		if (err) { res.status(400).send({ error: err }) }
		else {
			//Get all articles with username
			if (items) { res.status(200).send({ articles: items }) }
			else { res.status(404).send({ result: 'No matched items!' }) }
		}
	})
}

const getArticlesById = (req, res, id) => {
	Article.findById(id, (err, item) => {
		if (err) { res.status(400).send({ error: err }) }
		else {
			//Get article with Id
			if (item) { res.status(200).send({ articles: [item] }) }
			else { res.status(404).send({ result: 'No matched items!' }) }
		}
	})
}

const getArticlesByAuthors = (req, res, users) => {
	Article.find({ author: { $in: users } }).sort({ date: -1 }).limit(10).exec((err, items) => {
		if (err) { res.status(404).send({ error: err }) }
		else {
			if (items) { res.status(200).send({ articles: items }) }
			else { res.status(404).send({ result: 'No matched items!' }) }
		}
	})
}

const putArticles = (req, res) => {
	const id = req.params.id;
	const commentId = req.body.commentId
	if(commentId){
		if(commentId===-1){//Add a new comment
			Article.findByIdAndUpdate(id,{$push:{comments:{author: req.username, date: new Date().getTime(), text:req.body.text}}},{new:true},(err,item)=>{
				if(err){
					res.status(400).send({error:err})
				}
				else{
					if(item){
						res.status(200).send({articles:[item]})
					}
					else{
						res.status(404).send({result:'No matched items!'})
					}
				}
			})
		}
		else{//update the comment by commentId
			Article.findOneAndUpdate({_id:id, "comments._id":commentId},
				{$set:{"comments.$.text": req.body.text, "comments.$.date": new Date().getTime()}},
				{new:true},
				(err,item)=>{
				if(err){
					res.status(400).send({error:err})
				}
				else{
					if(item){
						res.status(200).send({articles:[item]})
					}
					else{
						res.status(404).send({result:'No matched items!'})
					}
				}
			})
		}
	}
	else{//Update article
		Article.findByIdAndUpdate(id,{text:req.body.text},{new:true},(err,item)=>{
			if(err){
				res.status(400).send({error:err})
			}
			else{
				if(item){
					res.status(200).send({articles:[item]})
				}
				else{
					res.status(404).send({result:'No matched items!'})
				}
			}
		})
	}
}

module.exports = app => {
	app.post('/article', uploadImage('article'), postArticle)
	app.get('/articles/:id*?', getArticles)
	app.put('/articles/:id', putArticles)
}