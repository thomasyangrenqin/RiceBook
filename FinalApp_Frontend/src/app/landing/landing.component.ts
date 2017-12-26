import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../userinfo';
import { LandingService } from './landing.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	message: UserInfo;
  flag : Observable<string>;
  error: Observable<string>;
  success: Observable<string>;

  constructor(private router: Router, private landServ: LandingService) { }

  ngOnInit() {
  	this.flag = this.landServ.flag;
    this.error = this.landServ.error;
    this.success = this.landServ.success;
    this.landServ.start();
  }

  newUser = {account_name: '', display_name: '', email_address: '', 
  phone_number: '', birth_date: '', zipcode: '', password: '', password_confirm: ''};

  OnSubmit() {
  	this.landServ.register();
  }

  OnSubmit2() {
  	this.landServ.login();
  }

  loginByFB() {
    this.landServ.loginByFB();
  }

}
