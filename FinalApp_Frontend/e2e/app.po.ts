import { browser, by, element } from 'protractor';

export class Common {
  navigateTo() {
    return browser.get('/landing');
  }

  login() {
     element(by.css('#user_name')).clear()
     element(by.css('#login_password')).clear()
     element(by.css('#user_name')).sendKeys('ry13')
     element(by.css('#login_password')).sendKeys('111-111-115')
     element(by.css('#btnSubmit')).click()
  }



  register() {
  	element(by.css('#account_name')).clear()
  	element(by.css('#account_name')).sendKeys('ry13')
  	element(by.css('#email_address')).clear()
  	element(by.css('#email_address')).sendKeys('ry13@rice.edu')
  	element(by.css('#phone_number')).clear()
  	element(by.css('#phone_number')).sendKeys('111-111-1111')
  	// clear(element(by.css('#birth_date')))
  	element(by.css('#birth_date')).sendKeys('01/01/1994')
  	element(by.css('#zipcode')).clear()
  	element(by.css('#zipcode')).sendKeys('77005')
  	element(by.css('#password')).clear()
  	element(by.css('#password')).sendKeys('123')
  	element(by.css('#password_confirm')).clear()
  	element(by.css('#password_confirm')).sendKeys('123')
  	element(by.css('#submitRegister')).click()
  }

  updateProfile() {
  	element(by.css('#account_name')).clear()
  	element(by.css('#account_name')).sendKeys('fl23')
  	element(by.css('#email_address')).clear()
  	element(by.css('#email_address')).sendKeys('fl23@rice.edu')
  	element(by.css('#phone_number')).clear()
  	element(by.css('#phone_number')).sendKeys('111-111-2222')

  	element(by.css('#zipcode')).clear()
  	element(by.css('#zipcode')).sendKeys('77025')
  	element(by.css('#password')).clear()
  	element(by.css('#password')).sendKeys('1234')
  	element(by.css('#password_confirm')).clear()
  	element(by.css('#password_confirm')).sendKeys('1234')
  	element(by.css('#btnSubmit')).click()
  }
}
