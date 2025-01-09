import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-setup',
  imports: [CommonModule, CardModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SetupComponent {
  isSpinning = false;
  displayedNumber = '000000000';
  winnerNumber = '';

  prizes = [
    {
      name: 'Motocicleta',
      description: 'Una motocicleta',
      imagen:
        'https://image.made-in-china.com/2f0j00sldkSvpMlfou/Small-Size-Motorcycle-for-Adult-Children-49cc-50cc-Motorcycle-Mini-Cub-Motorbike-with-EEC.jpg',
    },
    {
      name: 'Motocicleta',
      description: 'Una motocicleta',
      imagen:
        'https://image.made-in-china.com/2f0j00sldkSvpMlfou/Small-Size-Motorcycle-for-Adult-Children-49cc-50cc-Motorcycle-Mini-Cub-Motorbike-with-EEC.jpg',
    },
  ];

  // Simula la llamada al backend para obtener el ganador
  getWinnerFromBackend(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('7423'); // Ganador enviado desde el backend
      }, 3000); // Simula un retraso de 3 segundos
    });
  }

  async startRaffle() {
    this.isSpinning = true;
    this.winnerNumber = '';

    // Generar números aleatorios durante 3 segundos
    const interval = setInterval(() => {
      this.displayedNumber = this.getRandomNumber();
    }, 100);

    // Obtener el ganador después de 3 segundos
    this.winnerNumber = await this.getWinnerFromBackend();

    clearInterval(interval); // Detener la animación
    this.isSpinning = false;
    this.displayedNumber = this.winnerNumber; // Mostrar el ganador
  }

  getRandomNumber(): string {
    const length = Math.floor(Math.random() * 5) + 1; // Números de 1 a 5 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }
}
