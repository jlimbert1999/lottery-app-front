import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Prize } from '../../../domain';
@Component({
  selector: 'prize-card',
  imports: [CardModule],
  template: `
    <div class="flex flex-row border border-slate-400 rounded-r-2xl">
      <div class="w-2/5 shrink-0">
        <img [src]="prize().image" class="h-[300px] w-full object-cover" />
      </div>
      <div class="p-4">
        <h6 class="mb-6 block font-semibold text-red-500 text-2xl">
          PREMIO NUMERO {{ prize().number }}
        </h6>
        <h4 class="mb-4 block text-3xl font-semibold">
          {{ prize().name }}
        </h4>
        <p class=" font-sans text-base font-normal text-gray-700">
          {{ prize().description }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizeCardComponent {
  prize = input.required<Prize>();
}
