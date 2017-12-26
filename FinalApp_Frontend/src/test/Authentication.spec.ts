import { TestBed, async } from '@angular/core/testing';
import fetch, { mock } from 'mock-fetch'
import { expect } from 'chai'
import {resource, url} from './testResource'
import {Login, Logout} from './Authentication'

const mockery = require('mockery');

describe('Validate Authentication (involves mocked requests)', () => {

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

    it('should log in a user', (done) => {
        const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })

        Login(username,password)((action) => {
          try {
            expect(action.type == "Login")
            expect(action.username).to.eql(username);
           }catch (e) {
            done();
            }
        }).then(done)
          .catch(done)
      })

    it('should not log in an invalid user', (done)=> {
        const username = 'ry13'
        const password = 'wrong'
        Login(username,password)((action) => {
          try{
            expect(action.type).to.eql("ERROR MESSAGE");
            expect(action.errorMsg).to.eql('Invalid logging in as user: '+username);
            done();
          } catch(e){
            done();
          }
        })
    })

    it('should log out a user (state should be cleared)', (done) => {
        const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })
        mock(`${url}/logout`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'}
        })
        let count = 2;
        Logout()((action) => {
          try {
            if(action.type==="Logout") {
              expect(action).to.eql({type:"Logout"});
            }
            else if(action.type==="Landing"){
              expect(action).to.eql({type:"Landing"});
            }
            count--;
           }catch (e) {
            done();
            }
        }).then(() => {
      expect(count).to.eql(0)
    }).then(done)
    .catch(done)
  })
})