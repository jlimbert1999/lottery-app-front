import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ParticipantService } from '../../services/participant.service';
import { TableModule } from 'primeng/table';
import { Prize } from '../../../domain';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-winners',
  imports: [TableModule, ButtonModule, CommonModule],
  template: `
    <p-table
      [value]="datasource()"
      [paginator]="true"
      [rows]="10"
      [tableStyle]="{ 'min-width': '50rem' }"
    >
      <ng-template #caption>
        <div class="flex justify-end">
          <p-button
            label="Exportar"
            [outlined]="true"
            icon="pi pi-file-export"
            (click)="export()"
          />
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width:5%">Nro.</th>
          <th style="width:20%">Premio</th>
          <th style="width:30%">Contribuyente</th>
          <th style="width:10%">Tipo</th>
          <th style="width:25%">Documento</th>
          <th style="width:10%">Numero</th>
        </tr>
      </ng-template>
      <ng-template #body let-customer>
        <tr>
          <td>{{ customer.number }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.participant.fullname }}</td>
          <td>{{ customer.participant.type }}</td>
          <td>{{ customer.participant.codeType }}</td>
          <td>
            {{ customer.participant.code }}
          </td>
        </tr>
      </ng-template>
      <ng-template #emptymessage>
        <tr>
          <td colspan="6">Sin resultados</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersComponent implements OnInit {
  private participantService = inject(ParticipantService);
  datasource = signal<Prize[]>([]);

  ngOnInit(): void {
    this.getWinners();
  }

  getWinners() {
    return this.participantService.getWinners().subscribe((winners) => {
      this.datasource.set(winners);
    });
  }

  export() {
    this.participantService.generatePdf(this.datasource());
  }
}
