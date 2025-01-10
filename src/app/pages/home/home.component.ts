import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
@Component({
  selector: 'app-home',
  imports: [Menubar, RouterModule],
  template: ` <div class="card">
    <p-menubar [model]="items" />
    <div class="m-2 p-2 border rounded-md">
      <router-outlet />
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items: MenuItem[] = [
    {
      label: 'Participantes',
      icon: 'pi pi-users',
      routerLink: 'participants',
    },
    {
      label: 'Premios',
      icon: 'pi pi-gift',
      routerLink: 'prizes',
    },
  ];
}
