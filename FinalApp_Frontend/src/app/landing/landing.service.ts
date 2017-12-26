import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestOptionsArgs, Headers, Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserInfo } from '../userinfo'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LandingService {
	error: Observable<string>
  success: Observable<string>
  flag: Observable<string>
	private _error: BehaviorSubject<string>;
  private _success: BehaviorSubject<string>;
  private _flag: BehaviorSubject<string>;
	private users: UserInfo[];
  private server = "https://finalappbackend.herokuapp.com";
  
  constructor(private http: HttpClient, private router: Router) {
  		this._error = <BehaviorSubject<string>>new BehaviorSubject("");
  		this.error = this._error.asObservable();
      this._success = <BehaviorSubject<string>>new BehaviorSubject("");
      this.success = this._success.asObservable();
      this._flag = <BehaviorSubject<string>>new BehaviorSubject("");
      this.flag = this._flag.asObservable();
   }

  public start() {
    this._success.next("");
    this._error.next("");
    this._flag.next("");
  }

  public login() {
    let username = (<HTMLInputElement>document.getElementById("user_name"));
    let password = (<HTMLInputElement>document.getElementById("login_password"));
    let payload = { username: username.value, password: password.value};
    this.http.post(this.server+'/login', payload,{ withCredentials: true })
    .subscribe(data => {
      this._success.next("true");
      this.router.navigateByUrl('/main');
      localStorage.setItem("User", data['username']);
    },
    err => {
      this._error.next(err.error.result);
      console.log(err.error);
    })
  }

  public register() {
    let username = (<HTMLInputElement>document.getElementById("account_name"));
    let password = (<HTMLInputElement>document.getElementById("password"));
    let email = (<HTMLInputElement>document.getElementById("email_address"));
    let zipcode = (<HTMLInputElement>document.getElementById("zipcode"));
    let dob = (<HTMLInputElement>document.getElementById("birth_date"));
    let payload = {username : username.value, password: password.value, email: email.value, zipcode: zipcode.value, dob: dob.value}
    this.http.post(this.server+'/register', payload, { withCredentials: true })
    .subscribe(data => {
      this._flag.next(data['result']);
    },
    err => {
      this._flag.next(err.error.result);
    })
  }

  public loginByFB() {
    document.location.href = 'https://finalappbackend.herokuapp.com/login/facebook';
  }
}
