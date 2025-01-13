import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  catchError,
  debounce,
  interval,
  Subject,
  Subscription,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParticipantService } from '../../services/participant.service';
import { ButtonModule } from 'primeng/button';
import { Prize } from '../../../domain';
import { PrizeCardComponent } from '../prize-card/prize-card.component';

@Component({
  selector: 'raffle',
  imports: [CommonModule, ButtonModule, PrizeCardComponent],
  template: `
    <div class="flex flex-col justify-center items-center gap-y-6 h-full">
      <div class="w-full sm:w-9/12">
        <prize-card [prize]="prize()!" />
      </div>
      @if(prize()?.participant){
      <div class="flex items-center w-full px-4">
        <span class="h-px flex-1 bg-black"></span>
        <span class="shrink-0 px-6 text-xl font-bold sm:text-4xl">
          GANADOR
        </span>
        <span class="h-px flex-1 bg-black"></span>
      </div>

      <div class="text-balance text-xl font-semibold text-gray-500 sm:text-6xl">
        {{ prize()?.participant?.codeType }}
      </div>

      <div class="text-6xl border-4 rounded-full px-8 py-3 border-gray-600">
        <span>
          {{ prize()?.participant?.code }}
        </span>
      </div>
      } @else {
      <div class="text-7xl font-semibold">
        {{ displayedNumber }}
      </div>
      <p-button
        label="INICIAR"
        [disabled]="isSearching()"
        (onClick)="startRaffle()"
        size="large"
      />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RaffleComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private startSubject = new Subject<void>();
  private participantService = inject(ParticipantService);

  prize = model.required<Prize | null>();
  onWinnerSelected = output<void>();

  displayedNumber = '000000000';
  private spinSubscription?: Subscription;

  isSearching = signal(false);

  constructor() {}

  ngOnInit(): void {
    if (!this.prize()) return;
    this.startSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounce(() => timer(this._getRandomDelay())),
        switchMap(() => this.participantService.getWinner(this.prize()!.id))
      )
      .subscribe({
        next: (prize) => {
          this.stopRaffle();
          console.log(prize);
          this.prize.set(prize);
        },
        error: (error) => {
          this.stopRaffle();
        },
      });
  }

  startRaffle() {
    if (this.isSearching()) return;
    this.isSearching.set(true);
    this.displayedNumber = '000000000';
    this.spinSubscription = interval(100).subscribe(() => {
      this.displayedNumber = this.getRandomNumber();
    });
    this.startSubject.next();
  }

  stopRaffle() {
    if (this.spinSubscription) {
      this.spinSubscription.unsubscribe();
    }
    this.isSearching.set(false);
  }

  getRandomNumber(): string {
    const length = Math.floor(Math.random() * 8) + 5; // Números de 1 a 5 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }

  private _getRandomDelay() {
    return Math.floor(Math.random() * (12000 - 6000 + 1)) + 6000;
  }
}
