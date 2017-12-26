import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
  {path: 'landing', component: LandingComponent},
  {path: 'main', component: MainComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'article', component: ArticleComponent},
  {path: '', redirectTo: '/landing', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
