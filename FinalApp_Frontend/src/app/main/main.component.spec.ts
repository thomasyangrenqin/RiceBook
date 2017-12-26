import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule,MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { MainComponent } from './main.component';
import { MainService } from './main.service';
import { ArticlesService } from '../article/articles.service'
import { ArticleComponent } from '../article/article.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule,MatCardModule, FormsModule, HttpClientModule, RouterTestingModule],
      providers: [MainService, ArticlesService],
      declarations: [ MainComponent, ArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
