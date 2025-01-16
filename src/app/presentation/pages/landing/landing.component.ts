import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

import { ParticipantService } from '../../services/participant.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [ButtonModule, RouterModule],
  template: `
    <section
      class="h-screen w-screen flex flex-col justify-center items-center animate__animated animate__fadeIn animate__slow"
    >
      <div class="absolute top-0 right-0 p-2 sm:p-4">
        <img
          src="images/institution.jpeg"
          class="w-32 sm:w-52"
          alt="Institution image"
        />
      </div>
      <div
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
      <div class="mx-auto max-w-screen-xl px-4">
        <div class="mx-auto max-w-3xl text-center">
          <div
            class="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text font-extrabold text-transparent"
          >
            <span class="sm:text-7xl">GRAN SORTEO</span>
            <span class="block text-4xl"> “AL BUEN CONTRIBUYENTE” SACABA </span>
          </div>

          <p
            class="mt-8 text-pretty text-md font-medium text-gray-500 sm:text-xl"
          >
            Participan todas las personas que hayan pagado sus impuestos y no
            tengan deudas pendientes con el municipio
          </p>

          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <p-button
              styleClass="w-32"
              label="Iniciar"
              severity="info"
              size="large"
              [raised]="true"
              [routerLink]="['/main']"
            />
          </div>
        </div>
      </div>
      <div class="mt-20">
        <dl
          class="grid grid-cols-1 gap-x-12 gap-y-16 text-center lg:grid-cols-2"
        >
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base/7 text-gray-600">Participantes registrados</dt>
            <dd
              class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
            >
              {{ appDetails().totalParticipants }}
            </dd>
          </div>
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base/7 text-gray-600">Premios habilitados</dt>
            <dd
              class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
            >
              {{ appDetails().totalPrizes }}
            </dd>
          </div>
        </dl>
      </div>
      <div class="absolute -z-10 bottom-0 right-0 blur-3xl">
        <div
          class=" left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private participantService = inject(ParticipantService);
  appDetails = toSignal(this.participantService.getAppDetails(), {
    initialValue: { totalParticipants: 0, totalPrizes: 0 },
  });
}
