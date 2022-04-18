import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApartmentsComponent } from './apartments/apartments.component';
import { HousesComponent } from './houses/houses.component';
import { PersonComponent } from './person/person.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'apartments', component: ApartmentsComponent },
  { path: 'houses', component: HousesComponent },
  { path: 'people', component: PersonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
