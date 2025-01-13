import { Participant } from '../../domain';
import {
  participantEntity,
  participantIndividual,
} from '../interfaces/participant.interface';

export class ParticipantMapper {
  static fromResponse(
    response: participantEntity | participantIndividual
  ): Participant {
    switch (response.group) {
      case 'ParticipantIndividual':
        const individual = response as participantIndividual;
        return {
          id: individual._id,
          fullname: `${individual.firstname} ${individual.middlename} ${individual.lastname}`,
          codeType: individual.codeType,
          code: individual.code,
          type: 'NATURAL',
          documentNumber: individual.dni,
        };

      default:
        const entity = response as participantEntity;
        return {
          id: entity._id,
          fullname: entity.name,
          code: entity.code,
          codeType: entity.codeType,
          documentNumber: entity.nit,
          type: 'JURIDICO',
        };
    }
  }
}
