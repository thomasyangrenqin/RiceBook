import { Common } from './app.po';
import { browser, by, element } from 'protractor';

describe('LandingPage test', () => {
	let page : Common;
	
	beforeEach(() => {
		page = new Common();
	});

	it('should login as test user', () => {
		page.navigateTo();
		page.login();
		browser.waitForAngular();
    	expect(browser.driver.getCurrentUrl()).toMatch('/main');
	});

	it('Register new user', () => {
		page.navigateTo();
		page.register();
		expect(element(by.css('#registerInfo')).getText()).toEqual("You've successfully registered!");
	})

	it("Should logout", () => {
		page.navigateTo();
		page.login();
		element(by.css('#btnLogout')).click();
		expect(browser.driver.getCurrentUrl()).toMatch('/landing');
	})
	
})

describe('ArticlePage test', () => {
	let page : Common;
	let original: number;

	beforeEach(() => {
		page = new Common();
		page.navigateTo();
		page.login();

		element.all(by.css('.article')).count().then(count => {
			original = count;
		});
	});

	it('Create new article and validate article appears in feed', () => {
		const newArticle = "post a new article";
		element(by.css('#addText')).sendKeys(newArticle);
		element(by.css('#addArticle')).click();
		expect(element.all(by.css('.article')).count()).toBe(original+1);
	})

	it('Edit an article and validate changed article text', () => {
		const newArticle = "post a new article";
		const editArticle = "edit this article";
		element(by.css('#addText')).sendKeys(newArticle);
		element(by.css('#addArticle')).click();
		let first = element.all(by.css('.article')).get(0);
		expect(first.all(by.tagName('p')).get(0).getText()).toEqual('post a new article');
		first.all(by.css('.btnEditArticle')).get(0).click();
		first.all(by.tagName('textarea')).get(0).clear();
		first.all(by.tagName('textarea')).get(0).sendKeys(editArticle);
		first.all(by.css('.btnSubmit')).get(0).click();
		expect(first.all(by.tagName('p')).get(0).getText()).toEqual('edit this article');
	})

	it(' Search for "Only One Article Like This" article and verify author', () => {
		const newArticle = "Only One Article Like This";
		element(by.css('#addText')).sendKeys(newArticle);
		element(by.css('#addArticle')).click();
		element(by.css('#search')).sendKeys(newArticle);
		expect(element.all(by.css('.article')).count()).toBe(1);
		expect(element.all(by.css('.article')).get(0).all(by.css('#author')).get(0).getText()).toEqual('ry13');
	})

})


describe('MainPage test', () => {
	let page : Common;
	let original: string;
	let originalNum: number;

	beforeEach(() => {
		page = new Common();
		page.navigateTo();
		page.login();

		element(by.css('.statusInfo')).getText().then(text => {
			original = text;
		})

		element.all(by.css('.followers')).count().then(count => {
			originalNum = count;
		});		
	});

	it('Update headline headline and verify change', () => {
		const newStatus = "this is new staus";
		expect(element(by.css('.statusInfo')).getText()).toEqual(original);
		element(by.css('#newStatus')).clear();
		element(by.css('#newStatus')).sendKeys(newStatus);
		element(by.css('.btnUpdate')).click();
		expect(element(by.css('.statusInfo')).getText()).toEqual(newStatus);
	})

	it("Add the 'Follower' user and verify following count increases by on", () => {
		const newFollower = 'fl23';//valid follower
		element(by.css('#addFollower')).clear();
		element(by.css('#addFollower')).sendKeys(newFollower);
		element(by.css('.btnAdd')).click();
		expect(element.all(by.css('.followers')).count()).toBe(originalNum+1);
	})

	it("Remove the Follower user and verify following count decreases by one, test should be safe, i.e., what if Follower is not being followed", () => {
		let first = element.all(by.css('.followers')).get(0);
		first.all(by.css('.btnUnfollow')).get(0).click();
		expect(element.all(by.css('.followers')).count()).toBe(originalNum-1);
	})
})

describe('ProfilePage test', () => {
	let page : Common;
	let originalEmail: string;
	let originalZipcode: string;
	let originalPassword: string;

	beforeEach(() => {
		page = new Common();
		page.navigateTo();
		page.login();
		element(by.css('#btnProfile')).click();

		element(by.css('#emailAddress')).getText().then(text => {
			originalEmail = text;
		})

		element(by.css('#zipCode')).getText().then(text => {
			originalZipcode = text;
		});

		element(by.css('#passWord')).getText().then(text => {
			originalPassword = text;
		});
	});

	it(" Update user email and verify", () => {
		expect(element(by.css('#emailAddress')).getText()).toEqual(originalEmail);
		page.updateProfile();
		expect(element(by.css('#emailAddress')).getText()).toEqual('fl23@rice.edu');
	})

	it("Update user zipcode and verify", () => {
		expect(element(by.css('#zipCode')).getText()).toEqual(originalZipcode);
		page.updateProfile();
		expect(element(by.css('#zipCode')).getText()).toEqual('77025');
	})

	it("Update user password and verify", () => {
		expect(element(by.css('#passWord')).getText()).toEqual(originalPassword);
		page.updateProfile();
		expect(element(by.css('#passWord')).getText()).toEqual('Updated');
	})
})