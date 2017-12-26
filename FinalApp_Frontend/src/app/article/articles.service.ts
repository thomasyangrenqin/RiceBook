import { Article, Comment } from './article';
import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ArticlesService {
	siteArticles: Observable<Article[]>
  siteComments: Observable<any>
  siteEditArticle: Observable<any>
  siteEditComment: Observable<any>
  siteAddComment: Observable<any>
	private _siteArticles: BehaviorSubject<Article[]>;
  private _siteComments: BehaviorSubject<any>;
  private _siteEditArticle: BehaviorSubject<any>;
  private _siteEditComment: BehaviorSubject<any>;
  private _siteAddComment: BehaviorSubject<any>;
  private dataCoreArticles: Article[];
  private datasiteArticles: Article[];
  private me;
  private dataComments: any;
  private dataEditArticle: any;
  private dataEditComment: any;
  private dataAddComment: any;
  private server = "https://finalappbackend.herokuapp.com";


	constructor(private http: HttpClient) {
    	this._siteArticles = <BehaviorSubject<Article[]>>new BehaviorSubject([]);
    	this.siteArticles = this._siteArticles.asObservable();
      this._siteComments = <BehaviorSubject<any>>new BehaviorSubject({});
      this.siteComments = this._siteComments.asObservable();
      this._siteEditArticle = <BehaviorSubject<any>>new BehaviorSubject({});
      this.siteEditArticle = this._siteEditArticle.asObservable();
      this._siteEditComment = <BehaviorSubject<any>>new BehaviorSubject({});
      this.siteEditComment = this._siteEditComment.asObservable();
      this._siteAddComment = <BehaviorSubject<any>>new BehaviorSubject({});
      this.siteAddComment = this._siteAddComment.asObservable();
      this.me = localStorage.getItem("User");
      this.dataComments = {};
      this.dataEditArticle = {};
      this.dataEditComment = {};
      this.dataAddComment = {};
	 }
    

    getArticles() {
      this.http.get(this.server+'/articles', { withCredentials: true })
      .subscribe(data => {
        this.dataCoreArticles = data["articles"];
        this.datasiteArticles = this.dataCoreArticles.slice();
        this._siteArticles.next(Object.assign([], this.datasiteArticles));
      },
      err => {
        console.log(err.error);
      })

    }

    addArticle() {
    	let inputText = (<HTMLInputElement>document.getElementById("addText"));
      let file = (<HTMLInputElement>document.getElementById("addImg")).files[0];
      if(inputText.value){
        let fd = new FormData();
        fd.append('text', inputText.value);
        if(file){
          fd.append('image', file);
        }
        this.http.post(this.server+'/article', fd, { withCredentials: true })
        .subscribe(data => {
          this.getArticles();
          this.clearText();
        },
        err => {
          console.log(err.error)
        })
      }
    }

    clearText() {
    	let inputText = (<HTMLInputElement>document.getElementById("addText"));
    	inputText.value = "";
  	}

  	//implemented search function for articles by string include method
  	searchArticles(search: string){
    	if(search){
      		search = search.toLowerCase();
      		this.datasiteArticles = this.dataCoreArticles.filter(function(article){
        		return article.author.toLowerCase().includes(search) || 
        		article.text.toLowerCase().includes(search);
      		});
    	}else{
      		this.datasiteArticles = this.dataCoreArticles.slice();
    	}
    	this._siteArticles.next(Object.assign([], this.datasiteArticles));
  	}

    editArticle(author: string, date: string, id: string){
      let inputText = (<HTMLInputElement>document.getElementById(author+ "+" +date));
      if(inputText.value){
        let body = { text:inputText.value };
        this.http.put(this.server+'/articles/'+id, body, { withCredentials: true })
        .subscribe(data => {
          this.getArticles();
          inputText.value = "";
        },
        err => {
          console.log(err.error);
        })
      }
    }

    addComment(author: string, date: string, id: string){
      let inputText = (<HTMLInputElement>document.getElementById(author+ "+" +date+ "+" +"c"));
      if(inputText.value){
        let body = { text:inputText.value, commentId:-1 };
        this.http.put(this.server+'/articles/'+id, body, { withCredentials: true })
        .subscribe(data => {
          this.getArticles();
          inputText.value = "";
        },
        err => {
          console.log(err.error);
        })
      }
    }

    editComment(author:string, date: string, Aid: string, Cid: string){
      let inputText = (<HTMLInputElement>document.getElementById(author+ "+" +date));
      if(inputText.value){
        let body = { text:inputText.value, commentId: Cid };
        this.http.put(this.server+'/articles/'+Aid, body, { withCredentials: true })
        .subscribe(data => {
          this.getArticles();
          inputText.value = "";
        },
        err => {
          console.log(err.error);
        })
      }
    }


    displayComments(author: string, date: string){
      if(!this.dataComments[author+date] || this.dataComments[author+date] == false){
        // this.dataComments = author;
        this.dataComments[author+date] = true;
        this._siteComments.next(Object.assign({}, this.dataComments));
      }else{
        this.dataComments[author+date] = false;
        this._siteComments.next(Object.assign({}, this.dataComments));
      }
    }

    IseditableArticle(author: string, date: string){
      if(!this.dataEditArticle[author+date] || this.dataEditArticle[author+date] == false){
        this.dataEditArticle[author+date] = true;
        this._siteEditArticle.next(Object.assign({}, this.dataEditArticle));
      }else{
        this.dataEditArticle[author+date] = false;
        this._siteEditArticle.next(Object.assign({}, this.dataEditArticle));
      }
    }

    IseditableComment(author: string, date: string){
      if(!this.dataEditComment[author+date] || this.dataEditComment[author+date] == false){
        this.dataEditComment[author+date] = true;
        this._siteEditComment.next(Object.assign({}, this.dataEditComment));
      }else{
        this.dataEditComment[author+date] = false;
        this._siteEditComment.next(Object.assign({}, this.dataEditComment));
      }
    }

    IsAddComment(author: string, date: string){
      if(!this.dataAddComment[author+date] || this.dataAddComment[author+date] == false){
        this.dataAddComment[author+date] = true;
        this._siteAddComment.next(Object.assign({}, this.dataAddComment));
      }else{
        this.dataAddComment[author+date] = false;
        this._siteAddComment.next(Object.assign({}, this.dataAddComment));
      }
    }
}
