import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ParticipantService } from '../../presentation/services/participant.service';
import { ReadExcelComponent } from '../../presentation/components';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { prizeResp } from '../../infrastructure';

@Component({
  selector: 'app-prizes',
  imports: [
    TableModule,
    ButtonModule,
    PaginatorModule,
    ReadExcelComponent,
    DataViewModule,
    CommonModule,
  ],
  template: `
    @if (isLoading()) {
    <read-excel (onLoad)="onExcelLoad($event)" />
    } @else {
    <div class="card sm:px-8">
      <p-dataview #dv [value]="datasource()" [rows]="5" [paginator]="true">
        <ng-template #list let-items>
        <div class="grid grid-cols-12 gap-4 grid-nogutter">
                <div class="col-span-12" *ngFor="let item of items; let first = first" class="col-span-12">
                    <div
                        class="flex flex-col sm:flex-row sm:items-center p-2 gap-4"
                        [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }"
                    >
                        <div class="md:w-40 relative flex justify-center">
                            <img
                                class="object-contain h-24"
                                [src]="item.image"
                            />

                        </div>
                        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                            <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                <div>
                                  <div class="text-lg font-bold">{{ item.name }}</div>
                                    <span class="font-medium text-secondary text-sm">{{ item.description }}</span>
                                </div>
                               
                            </div>
                            <div class="flex flex-col md:items-end gap-8">
                               
                                <div class="flex flex-row-reverse md:flex-row gap-2">
                                    <!-- <p-button icon="pi pi-pencil" [outlined]="true" /> -->
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ng-template>
      </p-dataview>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizesComponent implements OnInit {
  private participantService = inject(ParticipantService);
  datasource = signal<prizeResp[]>([]);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  isLoading = signal(true);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.participantService.getPrizes().subscribe((data) => {
      this.datasource.set(data);
      this.isLoading.set(false);
      console.log(data);
    });
  }

  onExcelLoad(data: { NRO: number; PREMIO: string; DESCRIPCION: string }[][]) {
    this.participantService.uploadPrizes(data[0]).subscribe(() => {
      this.getData();
    });
  }
}
