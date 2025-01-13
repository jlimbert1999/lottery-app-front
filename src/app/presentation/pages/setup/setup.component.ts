import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { PrizeCardComponent, RaffleComponent } from '../../components';
import { ParticipantService } from '../../services/participant.service';
import { Prize } from '../../../domain';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-setup',
  imports: [
    CommonModule,
    CardModule,
    RaffleComponent,
    DataViewModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SetupComponent implements OnInit {
  private participantService = inject(ParticipantService);

  prizes = signal<Prize[]>([]);
  currentPrize = signal<Prize | null>(null);

  ngOnInit(): void {
    this.getPrizes();
  }

  onSelectPrize(item: Prize) {
    this.currentPrize.set(item);
  }

  setWinnerPrize(prize: Prize | null) {
    console.log(prize);
    // this.prizes.update((values) => {
    //   const index = values.findIndex(({ id }) => id === prize.id);
    //   values[index] = prize;
    //   return [...values];
    // });
  }

  getPrizes() {
    this.participantService.getPrizes().subscribe((resp) => {
      this.prizes.set(resp);
    });
  }
}
