import { TestBed, async } from '@angular/core/testing';
import { MatToolbarModule,MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import fetch, { mock } from 'mock-fetch';
import { url, login, logout } from '../test/testResource';

const mockery = require('mockery');

describe('AppComponent', () => {
  beforeEach(async(() => {

    if (mockery.enable) {
       mockery.enable({warnOnUnregistered: false});
       mockery.registerMock('node-fetch', fetch);
       require('node-fetch');
    }

    TestBed.configureTestingModule({
      imports: [MatToolbarModule,MatCardModule, FormsModule,HttpClientModule, RouterTestingModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  afterEach(() => {
         let len = document.body.children.length
         /*while (document.body.children.length) {
             //document.body.removeChild(document.body.children[0]);
         }*/

         if (mockery.enable) {
           mockery.deregisterMock('node-fetch');
           mockery.disable();
         }
     });

  const createDOM = (username, password, message) => {
       const add = (tag, id, value) => {
           const el = document.createElement(tag);
           el.id = id;
           el.value = value;
           el.style = { display: 'inline' };
           document.body.appendChild(el);
           return el;
       };
       add('input', 'username', username);
       add('input', 'password', password);
       const d = add('div', 'message', message);
       d.innerHTML = message;
       return d;
   };

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  
});