import express, { Request, Response } from 'express';
import cors from 'cors';
import { Entry, Diagnosis, Gender, Patient, NonSensitivePatient } from './types';
import diagnosesdata from './data/diagnoses';
import patientsdata from './data/patients-full';
import { v1 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const diagnoses: Diagnosis[] = diagnosesdata;

const patients: NonSensitivePatient[] = patientsdata.map(({ ssn, ...rest }) => ({
  ...rest,
  gender: rest.gender as Gender, // Cast the gender to Gender enum
}));

const isGender = (gender: any): gender is Gender => {
  const genderValues = Object.keys(Gender)
    .map(key => Gender[key as keyof typeof Gender]);
  return genderValues.indexOf(gender) !== -1; // Works with ES6
};

const addPatient = (name: string, dateOfBirth: string, ssn: string, gender: Gender, occupation: string, entries: Entry[]): Patient => {
  const patient = {
    id: uuid(),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
    entries
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

// New route: Get a patient by ID
app.get('/api/patients/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Find the patient in the original patientsdata to include ssn and entries
  const patient = patientsdata.find(p => p.id === id);

  if (!patient) {
    return res.status(404).send('Patient not found');
  }

  return res.json(patient);
});

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

// In your main server file (e.g., index.ts)

app.post('/api/patients/:id/entries', (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = patientsdata.find(p => p.id === id);

  if (!patient) {
    return res.status(404).send('Patient not found');
  }

  // Extracting entry data from request body
  const { type, description, date, specialist, healthCheckRating, discharge, employerName, sickLeave } = req.body;

  try {
    // Validate and create a new entry based on the type
    let newEntry: Entry;

    switch (type) {
      case "HealthCheck":
        if (healthCheckRating === undefined) {
          return res.status(400).send('healthCheckRating is required for HealthCheck entries');
        }
        newEntry = {
          id: uuid(), // Assign a new UUID
          type: "HealthCheck",
          description,
          date,
          specialist,
          healthCheckRating: healthCheckRating,
          diagnosisCodes: parseDiagnosisCodes(req.body) // Extract diagnosis codes
        };
        break;

      case "Hospital":
        if (!discharge || !discharge.date || !discharge.criteria) {
          return res.status(400).send('discharge information is required for Hospital entries');
        }
        newEntry = {
          id: uuid(),
          type: "Hospital",
          description,
          date,
          specialist,
          discharge: {
            date: discharge.date,
            criteria: discharge.criteria
          },
          diagnosisCodes: parseDiagnosisCodes(req.body)
        };
        break;

      case "OccupationalHealthcare":
        if (!employerName) {
          return res.status(400).send('employerName is required for OccupationalHealthcare entries');
        }
        newEntry = {
          id: uuid(),
          type: "OccupationalHealthcare",
          description,
          date,
          specialist,
          employerName,
          sickLeave: sickLeave ? {
            startDate: sickLeave.startDate,
            endDate: sickLeave.endDate
          } : undefined,
          diagnosisCodes: parseDiagnosisCodes(req.body)
        };
        break;

      default:
        return res.status(400).send('Invalid entry type');
    }

    // Add the new entry to the patient's entries
    if (!patient.entries) {
      patient.entries = []; // Initialize if entries array does not exist
    }
    patient.entries.push(newEntry);

    return res.json(newEntry); // Return the newly created entry
  } catch (error) {
    console.error(error);
    return res.status(500).send('An unexpected error occurred.');
  }
});

app.post('/api/patients', (req: Request, res: Response) => {
  const { name, dateOfBirth, ssn, gender, occupation, entries } = req.body;

  if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
    return res.status(400).send('All fields are required.');
  }

  if (!isPatient(req.body)) {
    return res.status(400).send('Invalid patient data.');
  }

  const addedPatient = addPatient(name, dateOfBirth, ssn, gender, occupation, entries);
  return res.json(addedPatient); // Add return statement here
});

app.get('/api/ping', (_req: Request, res: Response) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
