import { Participant } from './participant.model';

interface prizeProps {
  id: string;
  number: number;
  name: string;
  description: string;
  image: string;
  isEnabled: boolean;
  participant?: Participant;
}

export class Prize implements prizeProps {
  id: string;
  number: number;
  name: string;
  description: string;
  image: string;
  isEnabled: boolean;
  participant?: Participant;

  constructor({
    id,
    number,
    name,
    description,
    image,
    isEnabled,
    participant,
  }: prizeProps) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.description = description;
    this.image = image;
    this.isEnabled = isEnabled;
    this.participant = participant;
  }
}
