import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { CategoryListComponent } from "./features/category/category-list/category-list.component";
import { AddCategoryComponent } from "./features/category/add-category/add-category.component";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { EditCategoryComponent } from "./features/category/edit-category/edit-category.component";
import { BlogpostListComponent } from "./features/blog-post/blogpost-list/blogpost-list.component";
import { AddBlogpostComponent } from "./features/blog-post/add-blogpost/add-blogpost.component";
import { MarkdownModule } from "ngx-markdown";
import { EditBlogpostComponent } from "./features/blog-post/edit-blogpost/edit-blogpost.component";
import { ImageSelectorComponent } from "./shared/components/image-selector/image-selector.component";

import { HomeComponent } from "./features/public/home/home.component";
import { BlogDetailsComponent } from "./features/public/blog-details/blog-details.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AboutUsComponent } from "./features/public/about-us/about-us.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { ImagesComponent } from "./features/images/images.component";
import { UserProfileComponent } from "./features/user-profile/user-profile.component";
import { NotificationComponent } from "./shared/NotificationComponent/NotificationComponent.component";
import { Admin2Component } from './features/admin2/admin2.component';
import { SuperHeroComponent } from './features/super-hero/super-hero.component';
import { SuperPowerComponent } from './features/superpower/superpower.component';
import { SidekickComponent } from './features/sidekick/sidekick.component';
import { ComicAppearanceComponent } from './features/comicappearance/comicappearance.component';
import { SidekickComicAppearanceComponent } from './features/sidekickcomicappearance/sidekickcomicappearance.component';
import { Home2Component } from './features/home2/home2.component';
import { SuperHeroDetailsComponent } from './shared/components/super-hero-details/super-hero-details.component';
import { SearchComponent } from './features/search/search.component';
import { OrderBasketComponent } from "./features/order-basket/order-basket.component";
import { PaymentPageComponent } from './features/payment-page/payment-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CategoryListComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    BlogpostListComponent,
    AddBlogpostComponent,
    EditBlogpostComponent,
    ImageSelectorComponent,
    HomeComponent,
    BlogDetailsComponent,
    LoginComponent,
    FooterComponent,
    AboutUsComponent,
    RegisterComponent,
    ImagesComponent,
    UserProfileComponent,
    NotificationComponent,
    Admin2Component,
    SuperHeroComponent,
    SuperPowerComponent,
    SidekickComponent,
    ComicAppearanceComponent,
    SidekickComicAppearanceComponent,
    Home2Component,
    SuperHeroDetailsComponent,
    SearchComponent,
    OrderBasketComponent,
    PaymentPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
