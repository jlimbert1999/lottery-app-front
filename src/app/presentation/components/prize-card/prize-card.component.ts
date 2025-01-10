import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { prizeResp } from '../../../infrastructure';

@Component({
  selector: 'prize-card',
  imports: [],
  template: `
    <div class="relative block rounded-tr-3xl border border-gray-100">
      <span
        class="absolute -right-px -top-px rounded-bl-3xl rounded-tr-3xl bg-rose-600 px-6 py-4 font-medium uppercase tracking-widest text-white"
      >
        PREMIO Nro.{{ prize().number }}
      </span>

      <img
        [src]="prize().image"
        class="h-80 w-[600px] rounded-tr-3xl object-fill"
      />

      <div class="p-4">
        <div class="text-4xl font-bold">
          {{ prize().name }}
        </div>

        <p class="mt-2 text-pretty text-gray-700">
          {{ prize().description }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizeCardComponent {
  prize = input.required<prizeResp>();
}
