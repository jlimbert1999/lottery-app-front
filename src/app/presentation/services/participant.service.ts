import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

import { environment } from '../../../environments/environment';
import {
  participantEntity,
  participantIndividual,
  ParticipantMapper,
  prize,
  PrizeMapper,
} from '../../infrastructure';
import { Prize } from '../../domain';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

type participantResponse = participantEntity[] | participantIndividual[];
interface paginationParams {
  limit: number;
  offset: number;
}
@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private http = inject(HttpClient);
  private readonly url = environment.baseUrl;

  getWinner(prizeId: string) {
    return this.http
      .get<prize>(`${this.url}/winner/${prizeId}`)
      .pipe(map((resp) => PrizeMapper.fromResponse(resp)));
  }

  uploadParticipants(data: Object[]) {
    return this.http.post(`${this.url}/participants`, { data });
  }

  uploadPrizes(data: Object[]) {
    return this.http.post(`${this.url}/prizes`, { data });
  }

  getParticipants({ limit, offset }: paginationParams) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ participants: participantResponse; length: number }>(
        `${this.url}/participants`,
        { params }
      )
      .pipe(
        map(({ participants, length }) => ({
          participants: participants.map((el) =>
            ParticipantMapper.fromResponse(el)
          ),
          length,
        }))
      );
  }

  getPrizes() {
    return this.http
      .get<prize[]>(`${this.url}/prizes`)
      .pipe(map((resp) => resp.map((el) => PrizeMapper.fromResponse(el))));
  }

  getWinners() {
    return this.http
      .get<prize[]>(`${this.url}/winners`)
      .pipe(map((resp) => resp.map((el) => PrizeMapper.fromResponse(el))));
  }

  getAppDetails() {
    return this.http.get<{
      totalParticipants: number;
      totalPrizes: number;
      totalInmueble: number;
      totalVehiculo: number;
      totalLicencia: number;
    }>(`${this.url}/details`);
  }

  generatePdf(prizes: Prize[]) {
    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      content: [
        {
          text: 'LISTADO DE PARTICIPANTES GANADORES',
          alignment: 'center',
          style: 'header',
        },
        {
          text: '“AL BUEN CONTRIBUYENTE” SACABA',
          alignment: 'center',
          style: 'subheader',
        },
        {
          fontSize: 9,
          table: {
            headerRows: 1,
            widths: [25, '*', '*', '*', '*', 100],
            body: [
              [
                { text: 'Nro', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Contribuyente', style: 'tableHeader' },
                { text: 'CI / NIT', style: 'tableHeader' },
                { text: 'Documento', style: 'tableHeader' },
                { text: 'Numero', style: 'tableHeader' },
              ],
              ...prizes.map((el) => [
                el.number,
                el.name,
                el.participant!.fullname,
                el.participant!.documentNumber,
                el.participant!.codeType,
                el.participant!.code,
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 0, 30],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
