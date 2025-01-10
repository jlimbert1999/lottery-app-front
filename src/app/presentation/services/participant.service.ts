import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { participant } from '../../domain/interfaces/participant.interface';
import {
  participantEntity,
  participantIndividual,
  prizeResp,
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
    return this.http.get(`${this.url}/winner/${prizeId}`);
  }
  getActivePrizes() {
    return this.http.get<prizeResp[]>(`${this.url}/prizes/active`);
  }

  uploadParticipants(data: Object[]) {
    return this.http.post(`${this.url}/participants`, { data });
  }

  uploadPrizes(data: Object[]) {
    return this.http.post(`${this.url}/prizes`, { data });
  }

  getParticipants({ limit, offset }: paginationParams): Observable<{
    participants: participant[];
    length: number;
  }> {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ participants: participantResponse; length: number }>(
        `${this.url}/participants`,
        {
          params,
        }
      )
      .pipe(
        map(({ participants, length }) => ({
          participants: participants
            .map((el) => {
              switch (el.group) {
                case 'ParticipantIndividual':
                  const individual = el as participantIndividual;
                  return {
                    id: individual._id,
                    fullname: `${individual.firstname} ${individual.middlename} ${individual.lastname}`,
                    codeType: individual.codeType,
                    code: individual.code,
                    type: 'NATURAL',
                    documentNumber: individual.dni,
                  };

                case 'ParticipantEntity':
                  const entity = el as participantEntity;
                  return {
                    id: entity._id,
                    fullname: entity.name,
                    code: entity.code,
                    codeType: entity.codeType,
                    documentNumber: entity.nit,
                    type: 'JURIDICO',
                  };
                default:
                  return null;
              }
            })
            .filter((item): item is participant => item !== null),
          length,
        }))
      );
  }

  getPrizes() {
    return this.http.get<any[]>(`${this.url}/prizes`);
  }
}
