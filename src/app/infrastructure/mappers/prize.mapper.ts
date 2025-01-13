import { Prize } from '../../domain';
import { prize } from '../interfaces/prize.interface';
import { ParticipantMapper } from './participant.mapper';

export class PrizeMapper {
  static fromResponse({ participant, ...props }: prize): Prize {
    return new Prize({
      id: props._id,
      ...props,
      participant: participant
        ? ParticipantMapper.fromResponse(participant)
        : undefined,
    });
  }
}
