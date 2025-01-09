import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { delay, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './app.component.html',
  //   template: `
  //     <div class="sorteo" style="height: 200px;">
  //       <h1>Sorteo</h1>
  //       <div class="animacion">
  //         <span>{{ numeroActual }}</span>
  //       </div>
  //       <button (click)="iniciarSorteo()" [disabled]="enSorteo">
  //         Iniciar Sorteo
  //       </button>
  //       <div *ngIf="ganador" class="resultado">
  //         <h2>¡Ganador!</h2>
  //         <p><strong>Código:</strong> {{ ganador.codigo }}</p>
  //         <p><strong>Nombre:</strong> {{ ganador.nombre }}</p>
  //       </div>
  //     </div>
  // </div>
  //   `,
  styleUrl: './app.component.css',
  animations: [],
})
export class AppComponent {
  numeroActual = '---'; // Número mostrado en la animación
  enSorteo = false; // Estado del sorteo
  ganador: { codigo: string; nombre: string } | null = null; // Datos del ganador

  iniciarSorteo() {
    this.enSorteo = true;
    this.ganador = null;

    // Inicia la animación de números aleatorios
    const intervalId = setInterval(() => {
      this.numeroActual = this.generarNumeroAleatorio();
    }, 100);

    // Simula una respuesta del backend con un retraso de 3 segundos
    this.simularRespuestaBackend()
      .pipe(delay(3000))
      .subscribe((ganador) => {
        clearInterval(intervalId); // Detener la animación
        setTimeout(() => {
          this.numeroActual = ganador.codigo; // Muestra el código del ganador
          this.ganador = ganador; // Asigna el ganador para mostrarlo en la vista
          this.enSorteo = false; // Habilita el botón de nuevo
        }, 1000); // Pausa breve para mejorar la experiencia visual
      });
  }

  generarNumeroAleatorio(): string {
    return String(Math.floor(Math.random() * 200 + 1)).padStart(4, '0');
  }

  simularRespuestaBackend() {
    // Simula el ganador con datos ficticios
    const ganador = { codigo: '0123', nombre: 'Juan Pérez' };
    return of(ganador); // Devuelve un observable que simula la respuesta
  }
}
