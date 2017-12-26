import { TestBed, async } from '@angular/core/testing';
import fetch, { mock } from 'mock-fetch'
import { expect } from 'chai'
import {resource, url} from './testResource'
import {displayError, displaySuccess, nav2Main, nav2Profile, nav2Landing} from './Actions';

const mockery = require('mockery');

describe('Validate resource actions', () => {

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


    it('resource should be a resource (i.e., mock a request)', (done) => {
        mock(`${url}/headlines`, {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
            json:{
                username: 'guest',
                headline: 'my headline'
            }
        })

        resource('GET', 'headlines', '')
            .then((res) => {
                expect(res).to.eql({
                    username: 'guest',
                    headline: 'my headline'
                })
            })
            .then(done)
            .catch(done)
    })

    it('resource should give me the http error', (done) => {
        resource('GET', 'somethingWrong', '').then((res) => {
        })
        .then(done)
        .catch((err) => {
            expect(err).to.exist
            done()
        })
    })

    it('resource should be POSTable', (done) => {
        const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })

        resource('POST', 'login', {username, password}).then((response) => {
            expect(response).to.eql({username: "guest", result: "success"})
        })
        .then(done)
        .catch(done)
    })

    it('should update error message (for displaying error mesage to user)', (done)=>{
        const msg = 'Error message';
        expect(displayError(msg)).to.eql({type: "ERROR MESSAGE", errorMsg : msg});
        done();
    })


    it('should update success message (for displaying success message to user)', (done)=>{
        const msg = 'Success message';
        expect(displaySuccess(msg)).to.eql({type: "SUCCESS MESSAGE", successMsg: msg});
        done();
    })


    it('should navigate (to profile, main, or landing)', (done)=>{
        expect(nav2Landing()).to.eql({type: "Landing"});
        expect(nav2Main()).to.eql({type: "Main"});
        expect(nav2Profile()).to.eql({type: "Profile"});
        done();
    })

})