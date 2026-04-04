import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { ZooComponent } from './zoo/zoo.component';
import { BirdsComponent } from './birds/birds.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'weather-forecast', component: WeatherForecastComponent },
    { path: 'zoo', component: ZooComponent },
  { path: 'birds', component: BirdsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
