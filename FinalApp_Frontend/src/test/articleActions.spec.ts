import { TestBed, async } from '@angular/core/testing';
import fetch, { mock } from 'mock-fetch'
import { expect } from 'chai'
import {resource, url} from './testResource'
import {getArticles, getArticle, searchKeyword} from './articleActions'

const mockery = require('mockery');

describe('Validate Article actions', () => {

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

    it('should fetch articles (mocked request)', (done) => {
		const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })
		mock(`${url}/articles`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			json: { articles: [{ _id: 1, author: 'ry13', text: "test part", comments: [] }] }
		})

		getArticles()((action) => {
			expect(action.type).to.eql("Articles")
			expect(action.articles['1']).to.eql({ _id: 1, author: 'ry13', text: "test part", comments: [] })
		})
		done();
	})

    it('should filter displayed articles by the search keyword', (done) => {
		const username = 'guest'
        const password = 'visitor'
        
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {"username": username, "password": password}
        })
		mock(`${url}/articles/fl23`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			json: { articles: [{ _id: 1, author: 'ry13', text: "test part", comments: [] },{_id: 2, author: "fl23", text: "text part2", comments:[]}] }
		})

		getArticle("fl23")((action) => {
			expect(action.type).to.eql("Articles")
			expect(action.articles['1']).to.eql({ _id: 2, author: 'fl23', text: "test part2", comments: [] })
		})
		done();
	})

	it('should update the search keyword', () => {
		const keyword = 'testkeyword'
		expect(searchKeyword(keyword).type).to.eql("search")
		expect(searchKeyword(keyword).keyword).to.eql(keyword)
	})

})