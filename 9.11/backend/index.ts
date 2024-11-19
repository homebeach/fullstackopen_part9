import express from 'express';
import cors from 'cors';
import diagnosesdata from './data/diagnoses';
import patientsdata from './data/patients';

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

app.get('/api/diagnoses', (_req: any, res: any) => {
  res.send(diagnoses);
});

app.get('/api/patients', (_req: any, res: any) => {
  res.send(patients);
});

app.get('/api/ping', (_req: any, res: any) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
