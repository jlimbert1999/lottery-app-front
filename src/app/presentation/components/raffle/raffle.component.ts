import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  model,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import {
  debounce,
  interval,
  Subject,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

import { ParticipantService } from '../../services/participant.service';
import { Prize } from '../../../domain';
@Component({
  selector: 'raffle',
  imports: [CommonModule, ButtonModule, ProgressBarModule],
  template: `
    <div class="flex flex-col gap-y-6 items-center">
      <div class="h-1/6 w-full">
        <div
          class="text-center animate__animated animate__pulse animate__infinite"
        >
          <!-- <img
            src="images/institution.jpeg"
            class="mx-auto w-48"
            alt="Institution image"
          /> -->
          <div
            class="font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            GRAN SORTEO
          </div>
          <div
            class="mt-2 text-balance text-md font-semibold tracking-tight text-gray-900 sm:text-3xl"
          >
            “AL BUEN CONTRIBUYENTE” SACABA
          </div>
        </div>
      </div>

      <div
        class="flex space-x-6 border border-slate-400 rounded-lg w-10/12 h-2/6"
      >
        <img [src]="prize().image" class="object-fill h-48 w-96 rounded-lg" />
        <div class="flex-1 py-2">
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

      <div class="h-3/6 w-full mt-6 text-center">
        @if(prize().participant){
        <div class="animate__animated animate__fadeInDown">
          <div class="text-center space-y-4">
            <div class="text-2xl font-semibold animate__animated">GANADOR</div>
            <div class="text-6xl">{{ prize().participant?.codeType }}</div>
          </div>
          <div
            class="text-8xl font-semibold border-2 px-6 py-2 rounded-xl border-slate-400 w-full text-center text-sky-600"
          >
            {{ prize().participant?.code }}
          </div>
        </div>
        } @else {
        <div
          class="text-8xl font-semibold border-2 px-6 py-2 rounded-xl border-slate-400 w-full text-center"
        >
          {{ displayedNumber() }}
        </div>
        @if(isRunning()){
        <div class="card w-full py-4">
          <p-progressbar mode="indeterminate" [style]="{ height: '12px' }" />
        </div>
        <p-button
          label="DETENER"
          (onClick)="stopRaffle()"
          size="large"
          severity="danger"
          styleClass="mt-4"
        />
        } @else {
        <p-button
          label="INICIAR"
          [disabled]="!prize()"
          (onClick)="startRaffle()"
          size="large"
          styleClass="mt-4"
        />
        } }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RaffleComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private participantService = inject(ParticipantService);

  private spinSubscription?: Subscription;

  prize = model.required<Prize>();
  displayedNumber = signal<string>('------');
  isRunning = signal(false);

  constructor() {
    effect(() => {
      const winnerCode = this.prize().participant?.code ?? '0000000';
      untracked(() => {
        this.displayedNumber.set(winnerCode);
      });
    });
  }

  ngOnInit(): void {}

  startRaffle(): void {
    if (this.isRunning()) return;
    this.isRunning.set(true);
    this.spinSubscription = interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.displayedNumber.set(this._getRandomNumber());
      });
  }

  stopRaffle() {
    if (!this.isRunning()) return;
    this.participantService.getWinner(this.prize().id).subscribe({
      next: (prize) => {
        this.prize.set(prize);
        this.isRunning.set(false);
        this.spinSubscription?.unsubscribe();
      },
      error: () => {
        this.isRunning.set(false);
        this.spinSubscription?.unsubscribe();
      },
    });
  }

  private _getRandomNumber(): string {
    const lettersAndSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const length = Math.floor(Math.random() * 8) + 5; // Longitud entre 5 y 12 caracteres
    let result = '';

    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) {
        // Alterna entre números y caracteres
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result += numbers[randomIndex];
      } else {
        const randomIndex = Math.floor(
          Math.random() * lettersAndSymbols.length
        );
        result += lettersAndSymbols[randomIndex];
      }
    }

    return result;
  }
}
