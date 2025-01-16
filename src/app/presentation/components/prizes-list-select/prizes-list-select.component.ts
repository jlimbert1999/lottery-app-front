import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Prize } from '../../../domain';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'prizes-list-select',
  imports: [CommonModule, DataViewModule, TagModule, ButtonModule],
  template: `
    <p-dataview [value]="datasource()" emptyMessage="Sin resultados">
      <ng-template #list let-items>
        <div class="grid grid-cols-12 grid-nogutter">
          @for (item of items; track $index) {
          <div
            class="col-span-12"
            [ngClass]="{ 'bg-blue-100': selectedItem()?.id === item.id }"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center p-2 gap-4"
              [ngClass]="{
                'border-t border-surface-700': $index !== 0
              }"
            >
              <div class="md:w-32 relative flex justify-center">
                <img class="object-contain h-24" [src]="item.image" />
              </div>
              <div
                class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
              >
                <div
                  class="flex flex-row md:flex-col justify-between items-start gap-2"
                >
                  <div>
                    <span class="font-bold text-lg">
                      {{ item.number }} - {{ item.name }}
                    </span>
                    <div class="text-sm font-medium">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  @if(item.participant){
                  <p-tag severity="success" value="Sorteado" />
                  } @else {
                  <p-tag severity="warn" value="Pendiente" />
                  }
                  <div class="flex flex-row-reverse md:flex-row">
                    <p-button
                      icon="pi pi-arrow-right"
                      [outlined]="true"
                      (onClick)="onSelectPrize(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </ng-template>
    </p-dataview>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizesListSelectComponent {
  datasource = input.required<Prize[]>();

  selectedItem = model.required<Prize | null>();

  onSelectPrize(item: Prize) {
    this.selectedItem.set(item);
  }
}
