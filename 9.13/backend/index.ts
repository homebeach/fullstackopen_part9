import express, { Request, Response } from 'express';
import cors from 'cors';
import diagnosesdata from './data/diagnoses';
import patientsdata from './data/patients';
import { v1 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Define the Diagnosis type
interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const diagnoses: Diagnosis[] = diagnosesdata;

// Define the Patient type
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
}

// Use Omit to create a PatientWithoutSsn type
type PatientWithoutSsn = Omit<Patient, 'ssn'>;

// Define the Patient type
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender; // Change the type of gender to Gender enum
  occupation: string;
}

// Define the type of gender enum
enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

const patients: PatientWithoutSsn[] = patientsdata.map(({ ssn, ...rest }) => ({
  ...rest,
  gender: rest.gender as Gender, // Cast the gender to Gender enum
}));

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const addPatient = (name: string, dateOfBirth: string, ssn: string, gender: Gender, occupation: string): Patient => {
  const patient = {
    id: uuid(),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  };
  patientsdata.push({ ...patient }); // Add the patient to patientsdata including ssn
  patients.push(patient); // Add the patient to the patients array without ssn
  return patient;
};

// Type predicate to check if the incoming data matches the Patient interface
const isPatient = (patient: any): patient is Patient => {
  return (
    typeof patient.name === 'string' &&
    typeof patient.dateOfBirth === 'string' &&
    typeof patient.gender === 'string' &&
    isGender(patient.gender) &&
    typeof patient.occupation === 'string'
  );
};

app.get('/api/diagnoses', (_req: Request, res: Response) => {
  res.send(diagnoses);
});

app.get('/api/patients', (_req: Request, res: Response) => {
  res.send(patients);
});

app.post('/api/patients', (req: Request, res: Response) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;

  if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
    return res.status(400).send('All fields are required.');
  }

  if (!isPatient(req.body)) {
    return res.status(400).send('Invalid patient data.');
  }

  const addedPatient = addPatient(name, dateOfBirth, ssn, gender, occupation);
  return res.json(addedPatient); // Add return statement here
});

app.get('/api/ping', (_req: Request, res: Response) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
