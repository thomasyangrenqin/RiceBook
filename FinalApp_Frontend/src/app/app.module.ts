import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatCardModule } from '@angular/material';
import { CommonModule } from '@angular/common';


import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';

import { AppRoutingModule } from './app-routing.module';
import { ArticlesService } from './article/articles.service';
import { MainService } from './main/main.service';
import { LandingService } from './landing/landing.service';
import { ProfileService } from './profile/profile.service';
import { BirthdateDirective } from './landing/birthdate.directive';
import { PasswordDirective } from './landing/password.directive';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    LandingComponent,
    MainComponent,
    ProfileComponent,
    BirthdateDirective,
    PasswordDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MatCardModule,
    MatToolbarModule,
    AppRoutingModule
  ],
  providers: [ArticlesService, MainService, LandingService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
