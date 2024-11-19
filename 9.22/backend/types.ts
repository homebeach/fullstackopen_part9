// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

// Define the Diagnosis type
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// Define the type of gender enum
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;