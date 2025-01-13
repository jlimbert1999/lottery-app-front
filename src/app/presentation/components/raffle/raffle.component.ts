import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
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
import { prizeResp } from '../../../infrastructure';

@Component({
  selector: 'raffle',
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="text-6xl font-bold mb-8">
        <span
          [ngClass]="{
            'animate-bounce': isSearching(),
            'text-green-500': !isSearching()
          }"
        >
          {{ displayedNumber }}
        </span>
      </div>
      <p-button
        label="INICIAR"
        [rounded]="true"
        [disabled]="isSearching()"
        (onClick)="startRaffle()"
        size="large"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RaffleComponent {
  private destroyRef = inject(DestroyRef);
  private startSubject = new Subject<void>();
  private participantService = inject(ParticipantService);

  prize = input.required<prizeResp>();
  onWinnerSelected = output<void>();

  displayedNumber = '000000000';
  private spinSubscription?: Subscription;

  isSearching = signal(false);

  constructor() {
    this.startSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounce(() => timer(2000)),
        switchMap(() =>
          this.participantService.getWinner(this.prize()._id).pipe(
            catchError((error) => {
              console.log('Error en getWinner:', error);
              return throwError(() => error); // Propagar el error para que el bloque error en subscribe lo capture
            })
          )
        )
      )
      .subscribe({
        next: (winner) => {
          console.log('se competl');
          this.stopRaffle();
        },
        error: (error) => {
          console.log(error);
          this.stopRaffle();
        },
      });
  }

  startRaffle() {
    this.startSubject.next();
    if (this.isSearching()) return;
    this.isSearching.set(true);
    this.displayedNumber = '000000000';
    this.spinSubscription = interval(100).subscribe(() => {
      this.displayedNumber = this.getRandomNumber();
    });
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
