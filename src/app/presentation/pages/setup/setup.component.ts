import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { RaffleComponent } from '../../components';
import { ParticipantService } from '../../services/participant.service';
import { Prize } from '../../../domain';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-setup',
  imports: [
    CommonModule,
    FormsModule,
    RaffleComponent,
    DataViewModule,
    ButtonModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    InputTextModule,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SetupComponent implements OnInit {
  private participantService = inject(ParticipantService);

  prizes = signal<Prize[]>([]);
  filteredPrizes = computed(() => this._filterPrizes());

  currentPrize = signal<Prize | null>(null);
  term = signal<string>('');

  message = computed(() => {
    const drawn = this.prizes().filter(({ participant }) => participant).length;
    if (drawn === 0) {
      return `${this.prizes().length} PRESMISO DISPONILBES`;
    }
    return `${drawn} Sorteados / ${this.prizes().length - drawn} Disponibles`;
  });

  ngOnInit(): void {
    this.getPrizes();
  }

  onSelectPrize(item: Prize) {
    this.currentPrize.set(item);
  }

  setWinnerPrize(prize: Prize) {
    this.prizes.update((values) => {
      const index = values.findIndex(({ id }) => id === prize.id);
      values[index] = prize;
      return [...values];
    });
  }

  getPrizes() {
    this.participantService.getPrizes().subscribe((resp) => {
      this.prizes.set(resp);
    });
  }

  private _filterPrizes(): Prize[] {
    if (!this.term()) return this.prizes();
    return this.prizes().filter(
      ({ name }) =>
        name.toLocaleLowerCase().indexOf(this.term().toLocaleLowerCase()) > -1
    );
  }
}
