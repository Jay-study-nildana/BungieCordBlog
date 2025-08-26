import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { BlogpostListComponent } from './features/blog-post/blogpost-list/blogpost-list.component';
import { AddBlogpostComponent } from './features/blog-post/add-blogpost/add-blogpost.component';
import { EditBlogpostComponent } from './features/blog-post/edit-blogpost/edit-blogpost.component';
import { HomeComponent } from './features/public/home/home.component';
import { BlogDetailsComponent } from './features/public/blog-details/blog-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { AboutUsComponent } from './features/public/about-us/about-us.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ImagesComponent } from './features/images/images.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { Admin2Component } from './features/admin2/admin2.component';
import { SuperHeroComponent } from './features/super-hero/super-hero.component';
import { SuperPowerComponent } from './features/superpower/superpower.component';
import { SidekickComponent } from './features/sidekick/sidekick.component';
import { ComicAppearanceComponent } from './features/comicappearance/comicappearance.component';
import { SidekickComicAppearanceComponent } from './features/sidekickcomicappearance/sidekickcomicappearance.component';
import { Home2Component } from './features/home2/home2.component';
import { SuperHeroDetailsComponent } from './shared/components/super-hero-details/super-hero-details.component';
import { SearchComponent } from './features/search/search.component';
import { OrderBasketComponent } from './features/order-basket/order-basket.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'profile', 
    component: UserProfileComponent 
  },
  {
    path: 'blog/:url',
    component: BlogDetailsComponent
  },
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/blogposts',
    component: BlogpostListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'admin/blogposts/add',
    component: AddBlogpostComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/blogposts/:id',
    component: EditBlogpostComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin/images',
    component: ImagesComponent
  },
  { 
    path: 'about', 
    component: AboutUsComponent 
  },
  {
    path: 'admin2',
    component: Admin2Component
  },
  {
    path: 'superhero',
    component: SuperHeroComponent
  },
  {
    path: 'superpower',
    component: SuperPowerComponent
  },
  {
    path: 'sidekick',
    component: SidekickComponent
  },
  {
    path: 'comicappearance',
    component: ComicAppearanceComponent
  },
  {
    path: 'sidekickcomicappearance',
    component: SidekickComicAppearanceComponent
  },
  { path: 'home2', component: Home2Component },
  { path: 'superhero/:id', component: SuperHeroDetailsComponent },
  { path: 'order-basket', component: OrderBasketComponent },
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }