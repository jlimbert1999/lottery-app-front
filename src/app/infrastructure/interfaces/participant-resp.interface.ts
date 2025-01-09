interface participantResp {
  _id: string;
  code: string;
  codeType: string;
  group: string;
}

export interface participantEntity extends participantResp {
  name: string;
  nit: string;
}

export interface participantIndividual extends participantResp {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  extension: string;
}
