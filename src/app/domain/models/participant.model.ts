interface participantProps {
  id: string;
  fullname: string;
  code: string;
  codeType: string;
  type: string;
  documentNumber: string;
}
export class Participant implements participantProps {
  id: string;
  fullname: string;
  code: string;
  codeType: string;
  type: string;
  documentNumber: string;
  constructor({
    id,
    fullname,
    code,
    codeType,
    type,
    documentNumber,
  }: participantProps) {
    this.id = id;
    this.fullname = fullname;
    this.code = code;
    this.codeType = codeType;
    this.type = type;
    this.documentNumber = documentNumber;
  }
}
