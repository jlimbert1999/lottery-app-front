import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

import { ParticipantService } from '../../services/participant.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [ButtonModule, RouterModule, CommonModule],
  template: `
    <div
      class="h-screen flex flex-col animate__animated animate__fadeIn animate__slow"
    >
      <div class="flex justify-between p-6 h-[140px]">
        <img
          src="images/institution.jpeg"
          class="w-32 sm:w-52"
          alt="Institution image"
        />
        <img
          src="images/slogan.png"
          class="w-32 sm:w-52"
          alt="Institution image"
        />
      </div>

      <div class="flex flex-col justify-center items-center flex-1">
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
              <span class="block text-4xl">
                AL "BUEN CONTRIBUYENTE 2da. VERSION" SACABA - 2025
              </span>
            </div>

            <p
              class="mt-8 text-pretty text-md font-medium text-gray-500 sm:text-xl"
            >
              Participan todos los contribuyentes naturales y juridicos que no
              tengan deudas pendientes con el municipio
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <p-button
                styleClass="w-32"
                label="Iniciar"
                severity="info"
                size="large"
                [raised]="true"
                [rounded]="true"
                [routerLink]="['/main']"
              />
            </div>
          </div>
        </div>
        <div class="mt-16 space-y-8">
          <dl class="grid grid-cols-1 gap-x-12 text-center lg:grid-cols-3">
            <div class="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt class="text-xl text-gray-600">Actividades economicas</dt>
              <dd
                class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
              >
                {{ appDetails().totalLicencia | number }}
              </dd>
            </div>
            <div class="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt class="text-xl text-gray-600">Vehiculos</dt>
              <dd
                class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
              >
                {{ appDetails().totalVehiculo | number }}
              </dd>
            </div>
            <div class="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt class="text-xl text-gray-600">Bienes Inmuebles</dt>
              <dd
                class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
              >
                {{ appDetails().totalInmueble | number }}
              </dd>
            </div>
          </dl>
          <dl class="grid grid-cols-2 gap-x-12 text-center">
            <div class="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt class="text-2xl text-gray-600">
                Total de participantes registrados
              </dt>
              <dd
                class="order-first text-xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
              >
                {{ appDetails().totalParticipants | number }}
              </dd>
            </div>

            <div class="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt class="text-2xl text-gray-600">Premios habilitados</dt>
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
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private participantService = inject(ParticipantService);
  appDetails = toSignal(this.participantService.getAppDetails(), {
    initialValue: {
      totalParticipants: 0,
      totalPrizes: 0,
      totalLicencia: 0,
      totalInmueble: 0,
      totalVehiculo: 0,
    },
  });
}
