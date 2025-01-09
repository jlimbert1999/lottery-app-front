import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  participantEntity,
  participantIndividual,
} from '../../infrastructure/interfaces/participant-resp.interface';
import { participant } from '../../domain/interfaces/participant.interface';

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
  private url = `${environment.baseUrl}/participants`;
  constructor() {}

  uploadParticipants(data: Object[]) {
    return this.http.post(this.url, { data });
  }

  getParticipants({ limit, offset }: paginationParams): Observable<{
    participants: participant[];
    length: number;
  }> {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ participants: participantResponse; length: number }>(this.url, {
        params,
      })
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
}
