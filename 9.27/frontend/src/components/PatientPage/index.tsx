import { Box, Table, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import { Diagnosis, Patient } from '../../types';
import patientService from "../../services/patients";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EntryDetails from './EntryDetails'; // Import the EntryDetails component

const PatientPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from the URL parameters
  const [patient, setPatient] = useState<Patient | null>(null); // Initialize patient as null
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]); // Store the list of diagnoses

  // Fetch the patient data based on ID from URL
  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getById(id); // Pass id to getById
        setPatient(fetchedPatient);
      }
    };
    void fetchPatient();
  }, [id]); // Dependency array includes id to refetch if the id changes

  // Fetch the list of diagnoses once
  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const diagnoses = await patientService.getDiagnoses(); // Fetch diagnosis list
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
  }, []);

  // Function to get the diagnosis name by its code
  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    if (!diagnosis) {
      console.warn(`Diagnosis code ${code} not found in the diagnoses list`); // Debugging
    }
    return diagnosis ? `${code} - ${diagnosis.name}` : `${code} (Unknown diagnosis)`;
  };

  if (!patient) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient Information
        </Typography>
      </Box>

      {/* Patient Details Table */}
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={patient.id}>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.occupation}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Patient Entries Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Entries
        </Typography>
        {patient.entries.length === 0 ? (
          <Typography variant="body2">No entries available</Typography>
        ) : (
          patient.entries.map((entry) => (
            <Box key={entry.id} border={1} borderRadius={2} padding={2} marginBottom={2}>
              <Typography variant="body1"><strong>{entry.date}</strong> - {entry.description}</Typography>
              <Typography variant="body2">Specialist: {entry.specialist}</Typography>

              {/* If there are diagnosis codes, render them */}
              {entry.diagnosisCodes && (
                <Typography variant="body2">
                  Diagnosis Codes: {entry.diagnosisCodes.map(code => getDiagnosisName(code)).join(', ')}
                </Typography>
              )}

              {/* Render entry-specific details using the EntryDetails component */}
              <EntryDetails entry={entry} />
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default PatientPage;
