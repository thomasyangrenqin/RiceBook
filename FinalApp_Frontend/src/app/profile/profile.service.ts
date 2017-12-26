import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserInfo } from '../userinfo'
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileService {
  private server = "https://finalappbackend.herokuapp.com";
	message: Observable<UserInfo>
  flag: Observable<string>
  linkerror: Observable<string>
	private _message: BehaviorSubject<UserInfo>;
  private _flag: BehaviorSubject<string>;
  private _linkerror: BehaviorSubject<string>;
	private dataMessage: { user: UserInfo};
	private me : string;

  constructor(private http: HttpClient, private router: Router) {
  		this._message = <BehaviorSubject<any>>new BehaviorSubject(UserInfo);
  		this.message = this._message.asObservable();
      this._flag = <BehaviorSubject<string>>new BehaviorSubject("");
      this.flag = this._flag.asObservable();
      this._linkerror = <BehaviorSubject<string>>new BehaviorSubject("");
      this.linkerror = this._linkerror.asObservable();
  		this.me = localStorage.getItem("User");
  		this.dataMessage = { user: new UserInfo()};
   }

   public load() {
    this._linkerror.next("");

    this.http.get(this.server+'/email', { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.email_address = data['email']
      this.dataMessage.user.account_name = data['username']
    },
    err => {
      console.log(err.error)
    })

    this.http.get(this.server+'/zipcode', { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.zipcode = data['zipcode']
    },
    err => {
      console.log(err.error)
    })

    this.http.get(this.server+'/dob', { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.dob = data['dob'][0].dob
    },
    err => {
      console.log(err.error)
    })

    this.http.get(this.server+'/avatars', { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.img = data['avatars'][0]['avatar']
    },
    err => {
      console.log(err.error)
    })
    this.dataMessage.user.password = "Encoded";

   	this._message.next(Object.assign({}, this.dataMessage).user);
   }

   public update() {
    let input_email = (<HTMLInputElement>document.getElementById("email_address"))
    this.http.put(this.server+'/email', {email: input_email.value}, { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.email_address = data['email']
    },
    err => {
      console.log(err.error)
    })

    let input_zipcode = (<HTMLInputElement>document.getElementById("zipcode"));
    this.http.put(this.server+'/zipcode',{zipcode: input_zipcode.value}, { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.zipcode = data['zipcode']
    },
    err => {
      console.log(err.error)
    })

    let input_password = (<HTMLInputElement>document.getElementById("password"));
    this.http.put(this.server+'/password', {password: input_password.value}, { withCredentials: true })
    .subscribe(data => {
      this.dataMessage.user.password = "Updated";
    },
    err => {
      console.log(err.error)
    })
  	this._message.next(Object.assign({}, this.dataMessage).user);
   }

   public changeImg() {
    let file    = (<HTMLInputElement>document.getElementById("addImg")).files[0];
    if(file){
      const fd = new FormData();
      fd.append('image', file);
      this.http.put(this.server+'/avatar', fd, { withCredentials: true })
      .subscribe(data => {
        this.dataMessage.user.img = data['avatar'];
        this._message.next(Object.assign({}, this.dataMessage).user);
      },
      err => {
        console.log(err.error);
      })
    }
   }

   public linkAccount() {
    let username = (<HTMLInputElement>document.getElementById("linkusername")).value;
    let password = (<HTMLInputElement>document.getElementById("linkpassword")).value;
    if(username && password){
      let body = {username : username, password : password};
      this.http.post(this.server+'/linkAccount', body, {withCredentials: true})
      .subscribe(data => {
        this._linkerror.next("You've successfully link the account. Try log in that account!")
      },
      err => {
        this._linkerror.next(err.error.result);
      })
    }
   }

   public unlinkAccount() {
    let username = (<HTMLInputElement>document.getElementById("linkusername")).value;
    let password = (<HTMLInputElement>document.getElementById("linkpassword")).value;
    if(username && password){
      let body = {username : username, password : password};
      this.http.post(this.server+'/unlinkAccount', body, {withCredentials: true})
      .subscribe(data => {
        this._linkerror.next("You've successfully unlink the account.")
      },
      err => {
        this._linkerror.next(err.error.result);
      })
    }
  }
}
