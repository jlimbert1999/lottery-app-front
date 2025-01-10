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
import { prizeResp } from '../../../infrastructure';
@Component({
  selector: 'app-setup',
  imports: [
    CommonModule,
    CardModule,
    PrizeCardComponent,
    RaffleComponent,
    DataViewModule,
    ButtonModule,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SetupComponent implements OnInit {
  private participantService = inject(ParticipantService);

  prizes = toSignal(this.participantService.getActivePrizes(), {
    initialValue: [],
  });

  currentPrize = signal<prizeResp | null>(null);

  ngOnInit(): void {}

  onSelectPrize(item: prizeResp) {
    this.currentPrize.set(item);
  }

  getWinner() {
    if (!this.currentPrize()) return;
    return this.participantService
      .getWinner(this.currentPrize()?._id!)
      .subscribe((data) => {
        console.log(data);
      });
  }

  
}
