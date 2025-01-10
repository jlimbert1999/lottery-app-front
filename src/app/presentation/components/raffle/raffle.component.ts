import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ParticipantService } from '../../services/participant.service';

@Component({
  selector: 'raffle',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="text-6xl font-bold mb-8">
        <span
          [ngClass]="{
            'animate-bounce': isSpinning,
            'text-green-500': !isSpinning && winnerNumber
          }"
        >
          {{ displayedNumber }}
        </span>
      </div>
      <button
        (click)="startRaffle()"
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        [disabled]="isSpinning"
      >
        Iniciar Sorteo
      </button>
    </div>
  `,
  styles: `
    @keyframes spin {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0);
      }
    }

    .animate-bounce {
      animation: spin 0.2s infinite;
    }

  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RaffleComponent {
  isSpinning = false;
  displayedNumber = '000000000';
  winnerNumber = '';
  private spinSubscription!: Subscription;

  private participantService = inject(ParticipantService);

  onStart = output<void>();

  // Simula la llamada al backend para obtener el ganador
  getWinnerFromBackend(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('7423'); // Ganador enviado desde el backend
      }, 3000); // Simula un retraso de 3 segundos
    });
  }

  async startRaffle() {
    this.onStart.emit()
    console.log('started');
    this.isSpinning = true;
    this.winnerNumber = '';

    // Observable que emite cada 100ms
    const spin$ = interval(20);

    // Suscríbete al Observable para cambiar los números
    this.spinSubscription = spin$.subscribe(() => {
      this.displayedNumber = this.getRandomNumber();
    });

    // Espera la respuesta del backend
    this.winnerNumber = await this.getWinnerFromBackend();

    // Detén la animación y muestra el ganador
    this.stopSpinning();
    this.displayedNumber = this.winnerNumber;
  }

  stopSpinning() {
    if (this.spinSubscription) {
      this.spinSubscription.unsubscribe();
    }
    this.isSpinning = false;
  }

  getRandomNumber(): string {
    const length = Math.floor(Math.random() * 8) + 5; // Números de 1 a 5 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }
}
