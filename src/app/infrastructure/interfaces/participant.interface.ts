interface participant {
  _id: string;
  code: string;
  codeType: string;
  group: string;
}

export interface participantEntity extends participant {
  name: string;
  nit: string;
}

export interface participantIndividual extends participant {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  extension: string;
}
