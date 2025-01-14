import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  participantEntity,
  participantIndividual,
  ParticipantMapper,
  prize,
  PrizeMapper,
} from '../../infrastructure';

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
}
