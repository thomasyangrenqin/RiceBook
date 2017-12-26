import { Article } from './article';
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './articles.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
	siteArticles : Observable<Article[]>;
  siteComments : Observable<any>;
  siteEditArticle : Observable<any>;
  siteEditComment: Observable<any>;
  siteAddComment: Observable<any>;
  me: string;
  constructor(private articleServ: ArticlesService) { }

  ngOnInit() {
    this.siteArticles = this.articleServ.siteArticles;
    this.siteComments = this.articleServ.siteComments;
    this.siteEditArticle = this.articleServ.siteEditArticle;
    this.siteEditComment = this.articleServ.siteEditComment;
    this.siteAddComment = this.articleServ.siteAddComment;
    this.articleServ.getArticles();
    this.me = localStorage.getItem("User");
    console.log(this.siteArticles)
  }

  addArticle() {
    this.articleServ.addArticle();
  }

  //implemented search function for articles by string include method
  searchArticles(search: string){
    this.articleServ.searchArticles(search);
  }

  displayComments(author: string, date: string){
    console.log(author);
    this.articleServ.displayComments(author, date);
    console.log(this.siteComments);
  }

  IseditableArticle(author: string, date: string){
    this.articleServ.IseditableArticle(author, date);
  }

  IseditableComment(author: string, date: string){
    this.articleServ.IseditableComment(author, date);
  }

  IsAddComment(author: string, date: string){
    this.articleServ.IsAddComment(author, date);
  }

  editArticle(author: string, date: string, id: string){
    this.articleServ.editArticle(author, date, id);
  }

  addComment(author: string, date: string, id: string){
    this.articleServ.addComment(author, date, id);
  }

  editComment(author:string, date: string, Aid: string, Cid: string){
    this.articleServ.editComment(author, date, Aid, Cid);
  }
}
