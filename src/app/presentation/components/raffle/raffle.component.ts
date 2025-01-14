import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
  signal,
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
    <div class="flex flex-col items-center gap-y-2 h-full w-full">
      <div class="flex flex-col h-1/6 w-full">
        <!-- <div
          class="text-center animate__animated animate__pulse animate__infinite"
        >
          <img
            src="images/institution.jpeg"
            class="mx-auto w-48"
            alt="Institution image"
          />
          <div
            class="mt-8 text-sm font-bold md:text-sm lg:text-sm xl:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            GRAN SORTEO
          </div>
          <div
            class="mt-4 text-balance text-md font-semibold tracking-tight text-gray-900 sm:text-3xl"
          >
            “AL BUEN CONTRIBUYENTE” SACABA
          </div>
        </div> -->
      </div>

      <div
        class="flex border border-slate-400 rounded-lg w-10/12 gap-x-6 h-2/6"
      >
        <img
          [src]="prize().image"
          class="object-fill max-h-full w-96 rounded-xl"
        />
        <div class="flex-1">
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
      <div
        class="h-4/6 flex flex-col items-center justify-center gap-y-4 w-full"
      >
        @if(prize().participant){
        <div class="text-center animate__animated animate__fadeInDown">
          <div class="text-2xl font-semibold animate__animated  ">GANADOR</div>
          <div class="text-6xl">{{ prize().participant?.codeType }}</div>
        </div>
        }
        <div
          class="text-8xl font-semibold border-2 px-6 py-2 rounded-xl border-slate-400 w-full text-center"
        >
          {{ displayedNumber() }}
        </div>

        @if(prize().participant){
        <!-- <div class="flex items-center w-full px-4">
          <span class="h-px flex-1 bg-black"></span>
          <span class="shrink-0 px-6 text-xl font-bold sm:text-4xl">
            GANADOR
          </span>
          <span class="h-px flex-1 bg-black"></span>
        </div>

        <div
          class="text-balance text-xl font-semibold text-gray-500 sm:text-6xl"
        >
          {{ prize()?.participant?.codeType }}
        </div>

        <div class="text-6xl border-4 rounded-full px-8 py-3 border-gray-600">
          <span>
            {{ prize()?.participant?.code }}
          </span>
        </div> -->
        } @else { @if(isSearching()){
        <div class="card w-full ">
          <p-progressbar mode="indeterminate" [style]="{ height: '12px' }" />
        </div>
        }
        <p-button
          label="INICIAR"
          [disabled]="isSearching() || !prize()"
          (onClick)="startRaffle()"
          size="large"
        />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RaffleComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private startSubject = new Subject<void>();
  private participantService = inject(ParticipantService);

  private spinSubscription?: Subscription;

  prize = model.required<Prize>();
  displayedNumber = signal<string>('00000000');
  isSearching = signal(false);

  ngOnInit(): void {
    this.startSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounce(() => timer(this._getRandomDelay())),
        switchMap(() => this.participantService.getWinner(this.prize().id))
      )
      .subscribe({
        next: (prize) => {
          this.stopRaffle();
          this.prize.set(prize);
        },
        error: () => {
          this.stopRaffle();
        },
      });
  }

  startRaffle(): void {
    if (this.isSearching()) return;
    this.isSearching.set(true);
    this.displayedNumber.set('00000000');
    this.spinSubscription = interval(100).subscribe(() => {
      this.displayedNumber.set(this._getRandomNumber());
    });
    this.startSubject.next();
  }

  stopRaffle() {
    this.spinSubscription?.unsubscribe();
    this.isSearching.set(false);
  }

  private _getRandomNumber(): string {
    const length = Math.floor(Math.random() * 8) + 5; // Números de 1 a 5 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }

  private _getRandomDelay() {
    return (Math.floor(Math.random() * (6 - 3 + 1)) + 3) * 1000;
  }
}
