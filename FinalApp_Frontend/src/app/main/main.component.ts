import { Component, OnInit } from '@angular/core';
import { Follower, Following } from './following'
import { MainService } from './main.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  siteFollowers : Observable<Follower[]>;
  siteUser$: Observable<Follower>;
  error: Observable<string>;


  constructor(private mainServ : MainService) { }

  ngOnInit() {
  	this.siteFollowers = this.mainServ.siteFollowers;
    this.siteUser$ = this.mainServ.siteUser;
    this.error = this.mainServ.error;
    this.mainServ.start();
  }

  addFollower(){
    this.mainServ.addFollower();
  }

  unFollow(theFollower: Follower){
  	this.mainServ.unFollow(theFollower);
  }

  updateStatus(){
    this.mainServ.updateStatus();
  }

  logOut(){
    this.mainServ.logOut();
  }

  ToProfile(){
    this.mainServ.ToProfile();
  }

}
