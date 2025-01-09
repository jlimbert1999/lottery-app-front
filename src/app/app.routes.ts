import { Routes } from '@angular/router';
import { ParticipantsComponent } from './pages/participants/participants.component';
import { HomeComponent } from './pages/home/home.component';
import { SetupComponent } from './presentation/pages/setup/setup.component';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [{ path: 'participants', component: ParticipantsComponent }],
  },
  { path: '**', pathMatch: 'full', redirectTo: '/home' },
];
