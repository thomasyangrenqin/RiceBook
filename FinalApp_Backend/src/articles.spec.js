const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = (path) => `http://localhost:3000${path}`

describe('Validate Article functionality', () => {
	it('GET and count the current number of articles, POST a new article, verify you get back what you added, then GET again and count the number verifying it increased by one', (done) => {
		let oldLength;
		fetch(url("/articles"), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => {
				expect(res.status).to.eql(200)
				return res.json();
			}).then(body => {
				expect(body.articles).to.exist;
				oldLength = body.articles.length;
			})

			//Post new article
			.then(_ => {
				return fetch(url("/article"),
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							text: 'Test article'
						})
					})
			}).then(res => {
				expect(res.status).to.eql(200)
				return res.json();
			}).then(body => {
				expect(body.articles[0].text).to.eql('Test article')
			}).then(_ => {
				return fetch(url("/articles"),
					{
						method: 'GET',
						headers: { 'Content-Type': 'application/json' },
					})
			}).then(res => {
				expect(res.status).to.eql(200)
				return res.json();
			}).then(body => {
				expect(body.articles).to.exist
				expect(body.articles.length).to.eql(oldLength + 1)
			})
			.then(done)
			.catch(done)
 	}, 200)
});