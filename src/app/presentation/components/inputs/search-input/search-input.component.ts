import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { SelectModule } from 'primeng/select';

export interface selectOption<T> {
  label: string;
  image?: string;
  value: T;
}
@Component({
  selector: 'search-input',
  imports: [ SelectModule],
  template: `
    <p-select
      [options]="items()"
      [placeholder]="placeholder()"
      [filter]="true"
      (onChange)="selectItem($event.value)"
      optionValue="value"
      optionLabel="label"
      filterBy="label"
      class="w-full"
      appendTo="body"
    >
      <ng-template let-element #item>
        <div class="flex items-center gap-2">
          @if(element.image){
          <img [src]="element.image" class="w-12" />
          }
          <div>{{ element.label }}</div>
        </div>
      </ng-template>
    </p-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent<T> {
  placeholder = input<string>('Seleccione una opcion');
  items = input.required<selectOption<T>[]>();
  onSelect = output<T>();

  selectedCountry: string | undefined;

  selectItem(event: T) {
    this.onSelect.emit(event);
  }
}
