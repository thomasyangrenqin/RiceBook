import { TestBed, async } from '@angular/core/testing';
import fetch, { mock } from 'mock-fetch'
import { expect } from 'chai'
import {resource, url} from './testResource'
import {getProfile, updateHeadline} from './profileActions'

const mockery = require('mockery');

describe('Validate Profile actions (mocked requests)', () => {

    beforeEach(async(() => {

    	if (mockery.enable) {
       		mockery.enable({warnOnUnregistered: false});
       		mockery.registerMock('node-fetch', fetch);
       		require('node-fetch');
    	}

  	}));

    afterEach(() => {

         if (mockery.enable) {
           mockery.deregisterMock('node-fetch');
           mockery.disable();
         }
     });

    it("should fetch the user's proile information", (done)=>{
		const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })
		mock(`${url}/accountName`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{ accountName:'ry13'}
		})
		mock(`${url}/displayName`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{ displayName:'ry13'}
		})
		mock(`${url}/email`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{email:'ry13@rice.edu'}
		})
		mock(`${url}/zipcode`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{zipcode:'77005'}
		})
		mock(`${url}/phoneNumber`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{phoneNumber:'123-123-1234'}
		})
		mock(`${url}/password`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{password:'yrq'}
		})

		let count = 6
		getProfile()((action) => { 
			try{
				if(action.accountName){
					expect(action.accountName).to.eql('ry13');
				}
				else if(action.displayName){
					expect(action.displayName).to.eql('ry13');
				}
				else if(action.email){
					expect(action.email).to.eql('ry13@rice.edu');
				}
				else if(action.zipcode){
					expect(action.zipcode).to.eql('77005');
				}
				else if(action.phoneNumber){
					expect(action.phoneNumber).to.eql('123-123-1234');
				}
				else if(action.password){
					expect(action.password).to.eql('yrq');
				}
				count--;
			}catch(e){
				done();
			}
		}).then(() => {
			expect(count).to.eql(0)
		}).then(done)
		.catch(done)
	})

	
	it('should update headline',(done)=> {
		const username = 'ry13'
		const headline = 'New headline'

		mock(`${url}/headline`, {
			method: 'PUT',
			headers: {'Content-Type':'application/json'},
			json: {username, headline}
		})

		updateHeadline(headline)((action)=>{
			try{
				expect(action.type).to.eql("Update")
				expect(action.headline).to.eql(headline)
				done();
			}catch(e){
				done();
			}
		})
		done();
	})

})