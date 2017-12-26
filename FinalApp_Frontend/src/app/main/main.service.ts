import { Injectable } from '@angular/core';
import { Follower, Following } from './following'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ArticlesService } from '../article/articles.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class MainService {
  private server = "https://finalappbackend.herokuapp.com";
	private datasiteFollowers : Follower[];
	private datasiteUser: { follower: Follower };
	siteFollowers: Observable<Follower[]>
	siteUser: Observable<Follower>
	private _siteFollowers: BehaviorSubject<Follower[]>;
	private _siteUser: BehaviorSubject<any>;
  error: Observable<string>
  private _error: BehaviorSubject<string>;
  private added: string;
  

  constructor(private http: HttpClient, private articleServ: ArticlesService, private router: Router) { 
  	this._siteFollowers = <BehaviorSubject<Follower[]>>new BehaviorSubject([]);
  	this.siteFollowers = this._siteFollowers.asObservable();
  	this._siteUser = <BehaviorSubject<any>>new BehaviorSubject(Follower);
  	this.siteUser = this._siteUser.asObservable();
  	this.datasiteUser = {follower : new Follower()};
    this.datasiteFollowers = new Array<Follower>();
    this._error = <BehaviorSubject<string>>new BehaviorSubject("");
    this.error = this._error.asObservable();
    this.added = "";
  }

  loadFollower() {
    this.datasiteFollowers = new Array<Follower>();
    this.http.get(this.server+'/following', { withCredentials: true })
    .subscribe(data => {
      let temp = data['following'];
      console.log(temp)
      temp.forEach(item => {
        let temp2 = new Follower();

        this.http.get(this.server+'/headlines/'+item, { withCredentials: true })
        .subscribe(data => {
         temp2.status = data['headlines'][0]['headline']
         temp2.name = data['headlines'][0]['username']
        },
        err => {
          console.log(err.error)
        })

        this.http.get(this.server+'/avatars/'+item, { withCredentials: true })
        .subscribe(data => {
          temp2.img = data['avatars'][0]['avatar']
        },
        err => {
          console.log(err.error)
        })
        this.datasiteFollowers.push(temp2);

      })
      console.log(this.datasiteFollowers);
      this._siteFollowers.next(Object.assign([], this.datasiteFollowers));
    },
    err => {
      console.log(err.error)
    })
  }

  start() {
    this.loadFollower();

    this.http.get(this.server+'/headlines', { withCredentials: true })
    .subscribe(data => {
      this.datasiteUser.follower.status = data['headlines'][0]['headline']
      this.datasiteUser.follower.name = data['headlines'][0]['username']
      localStorage.setItem("User", data['headlines'][0]['username']);
    },
    err => {
      console.log(err.error)
    })

    this.http.get(this.server+'/avatars', { withCredentials: true })
    .subscribe(data => {
      this.datasiteUser.follower.img = data['avatars'][0]['avatar']
      console.log(this.datasiteUser.follower.img)
    },
    err => {
      console.log(err.error)
    })
  	this._siteUser.next(Object.assign({}, this.datasiteUser).follower);
  }

   addFollower(){
    let newFollower = (<HTMLInputElement>document.getElementById("addFollower"));
    if(newFollower.value){
      this.http.get(this.server+'/following', { withCredentials: true })
      .subscribe(data => {
        if(data['following'].includes(newFollower.value)){
          this._error.next("You cannnot add repeated follower!")
        }else{
          this._error.next("");
        }
      },
      err => {
        console.log(err.error);
      })

      let body = {}
      this.http.put(this.server+'/following/'+newFollower.value, body, { withCredentials: true })
      .subscribe(data => {
        this.loadFollower();
        this.articleServ.getArticles();
        this._error.next("");
        newFollower.value = "";
      },
      err => {
        this._error.next(err.error.result);
      })    
    }
  }

  unFollow(theFollower: Follower){
  	let index = this.datasiteFollowers.indexOf(theFollower);
  	if(index > -1){
  		
      this.http.delete(this.server+'/following/'+theFollower.name, { withCredentials: true })
      .subscribe(data => {
        this.datasiteFollowers.splice(index,1);
        this._siteFollowers.next(Object.assign([], this.datasiteFollowers));
        this.articleServ.getArticles();
      },
      err => {
        console.log(err.error);
      })
  		
  	}
  }

  updateStatus(){
    let newStatus = (<HTMLInputElement>document.getElementById("newStatus"));
    if(newStatus.value){
      let body = {headline: newStatus.value}
      this.http.put(this.server+'/headline', body, { withCredentials: true })
      .subscribe(data => {
        this.datasiteUser.follower.status = data['headline']
        this._siteUser.next(Object.assign({}, this.datasiteUser).follower);
        newStatus.value = "";
      },
      err => {
        console.log(err.error);
      })
    }
  }

  logOut(){
    let body = {}
    this.http.put(this.server+'/logout', body, { withCredentials: true })
    .subscribe(data => {
      localStorage.removeItem("User");
    },
    err => {
      console.log(err.error);
    })
    
  }

  ToProfile(){
    this.http.get(this.server+'/profile', { withCredentials: true })
    .subscribe(data => {
      this.router.navigateByUrl('/profile');
      console.log(data['result'])
    },
    err => {
      console.log(err.error)
    })
  }
}
