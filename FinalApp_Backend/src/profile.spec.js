const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = (path) => `http://localhost:3000${path}`


describe('Validate profile functionality', () => {
	
	it('GET, PUT to change the value, GET to verify it was changed', (done) => {
		let oldheadline, newheadline;
		let test1 =  {
			method: 'GET',
        	headers: {'Content-Type': 'application/json'},
    	}
		fetch(url("/headlines"),test1)
		.then(res => {
			expect(res.status).to.eql(200)
			return res.json();
		}).then(body => {
			expect(body.headlines).to.exist;
			expect(body.headlines[0].headline).to.exist;
			oldheadline = body.headlines[0].headline;
		}).then( _=>{
			let test2 =  {
				method: 'PUT',
        		headers: {'Content-Type': 'application/json'},
        		body: JSON.stringify({
					headline: 'Old headline: ['+ oldheadline + '] is changed!'
        		})
    		}
		 	return fetch(url("/headline"),test2)
		}).then(res => {
			expect(res.status).to.eql(200)
			return res.json();
		}).then(body => {
			expect(body.headline).to.eql('Old headline: ['+ oldheadline + '] is changed!')
		}).then(_=>{
			return fetch(url("/headlines"),test1)
		}).then(res => {
			expect(res.status).to.eql(200)
			return res.json();
		}).then(body =>{
			expect(body.headlines).to.exist;
			expect(body.headlines[0].headline).to.exist;
			newheadline = body.headlines[0].headline;
			expect(newheadline).to.not.eql(oldheadline);
		})
		.then(done)
		.catch(done)
 	}, 200)
});