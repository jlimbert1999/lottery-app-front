import { Routes } from '@angular/router';
import { SetupComponent } from './presentation/pages/setup/setup.component';
import { HomeComponent } from './presentation/pages/home/home.component';
import { PrizesComponent } from './presentation/pages/prizes/prizes.component';
import { ParticipantsComponent } from './presentation/pages/participants/participants.component';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'participants', component: ParticipantsComponent },
      { path: 'prizes', component: PrizesComponent },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '/home' },
];
