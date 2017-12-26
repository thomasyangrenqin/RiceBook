import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../userinfo';
import { ProfileService } from './profile.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	message$: Observable<UserInfo>;
  flag: Observable<string>;
  linkerror: Observable<string>;

  constructor(private profileServ: ProfileService) { }

  ngOnInit() {
  	this.message$ = this.profileServ.message;
    this.flag = this.profileServ.flag;
    this.linkerror = this.profileServ.linkerror;
    this.profileServ.load();
  }

  newUser = {account_name: '', email_address: '', 
  birth_date: '', zipcode: '', password: '', password_confirm: ''};

  OnSubmit() {
  	this.profileServ.update();
  }

  changeImg() {
    this.profileServ.changeImg();
  }

  linkAccount() {
    this.profileServ.linkAccount();
  }

  unlinkAccount() {
    this.profileServ.unlinkAccount();
  }
}
