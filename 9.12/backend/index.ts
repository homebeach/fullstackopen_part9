import express from 'express';
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
  gender: string;
  occupation: string;
}

// Use Omit to create a PatientWithoutSsn type
type PatientWithoutSsn = Omit<Patient, 'ssn'>;

// Map patients data to exclude ssn
const patients: PatientWithoutSsn[] = patientsdata.map(({ ssn, ...rest }) => rest);

const addPatient = (name: string, dateOfBirth: string, ssn: string, gender: string, occupation: string): Patient => {

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


app.get('/api/diagnoses', (_req: any, res: any) => {
  res.send(diagnoses);
});

app.get('/api/patients', (_req: any, res: any) => {
  res.send(patients);
});

app.post('/api/patients', (req: any, res: any) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedPatient = addPatient(
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  );
  res.json(addedPatient);
});

app.get('/api/ping', (_req: any, res: any) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


