import {
  participantEntity,
  participantIndividual,
} from './participant.interface';

export interface prize {
  _id: string;
  number: number;
  name: string;
  description: string;
  image: string;
  participant?: participantEntity | participantIndividual;
  isEnabled: boolean;
}
