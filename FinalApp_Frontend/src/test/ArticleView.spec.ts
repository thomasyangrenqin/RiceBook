import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule,MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { ArticleComponent } from '../app/article/article.component';
import { ArticlesService } from '../app/article/articles.service';

describe('Articles View (component tests)', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule,MatCardModule, FormsModule,HttpClientModule, RouterTestingModule],
      providers: [ArticlesService],
      declarations: [ ArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should render articles', () => {
    component.ngOnInit();
    return component.siteArticles.toPromise().then((result) => {
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('should dispatch actions to create a new article', () => {
    component.ngOnInit();
    let len : number; 
    component.siteArticles.toPromise().then((result) => {
      len = result.length;
    });
    let de = fixture.debugElement.query(By.css('#addText'));
    let el = de.nativeElement;
    el.textContent = "new Articles";
    return component.siteArticles.toPromise().then((result) => {
      expect(result.length).toBeGreaterThan(len);
    });
  });
});
