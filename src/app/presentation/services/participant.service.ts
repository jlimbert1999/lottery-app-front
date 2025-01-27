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
import { convertImageABase64 } from '../../../helpers';

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

  async generatePdf(prizes: Prize[]) {
    const leftImage = await convertImageABase64('images/institution.jpeg');
    const rightImage = await convertImageABase64('images/slogan.png');
    prizes = prizes.sort((a, b) => a.number - b.number);
    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      pageMargins: [40, 90, 40, 40],
      header: {
        margin: [20, 20, 20, 20],
        columns: [
          {
            image: leftImage,
            width: 130,
            alignment: 'left',
          },
          [
            {
              text: 'LISTADO DE PARTICIPANTES GANADORES',
              alignment: 'center',
              style: 'header',
            },
            {
              text: '“SORTEO AL BUEN CONTRIBUYENTE” SACABA',
              alignment: 'center',
              style: 'subheader',
            },
          ],
          {
            image: rightImage,
            width: 130,
            alignment: 'right',
          },
        ],
      },
      content: [
        {
          fontSize: 9,
          table: {
            headerRows: 1,
            widths: [25, '*', '*',  "*"],
            body: [
              [
                { text: 'Nro', style: 'tableHeader' },
                { text: 'Premio', style: 'tableHeader' },
                { text: 'Documento', style: 'tableHeader' },
                { text: 'Numero', style: 'tableHeader' },
              ],
              ...prizes.map((el) => [
                el.number,
                el.name,
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
