import { Box, Table, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import HealthRatingBar from "../HealthRatingBar";
import { Patient, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../../types';
import patientService from "../../services/patients";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from the URL parameters
  const [patient, setPatient] = useState<Patient | null>(null); // Initialize patient as null

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getById(id); // Pass id to getById
        setPatient(fetchedPatient);
      }
    };
    void fetchPatient();
  }, [id]); // Dependency array includes id to refetch if the id changes

  if (!patient) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  const renderEntryDetails = (entry: Entry) => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <>
            <Typography variant="body1">Discharge Date: {entry.discharge?.date}</Typography>
            <Typography variant="body1">Discharge Criteria: {entry.discharge?.criteria}</Typography>
          </>
        );
      case 'OccupationalHealthcare':
        return (
          <>
            <Typography variant="body1">Employer: {entry.employerName}</Typography>
            {entry.sickLeave && (
              <>
                <Typography variant="body1">Sick Leave Start: {entry.sickLeave.startDate}</Typography>
                <Typography variant="body1">Sick Leave End: {entry.sickLeave.endDate}</Typography>
              </>
            )}
          </>
        );
      case 'HealthCheck':
        return (
          <>
            <Typography variant="body1">Health Rating:</Typography>
            <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient
        </Typography>
      </Box>
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

      <Box>
        <Typography variant="h6" gutterBottom>
          Entries
        </Typography>
        {patient.entries.map((entry) => (
          <Box key={entry.id} border={1} borderRadius={2} padding={2} marginBottom={2}>
            <Typography variant="body1"><strong>{entry.date}</strong> - {entry.description}</Typography>
            <Typography variant="body2">Specialist: {entry.specialist}</Typography>
            {entry.diagnosisCodes && (
              <Typography variant="body2">
                Diagnosis Codes: {entry.diagnosisCodes.join(', ')}
              </Typography>
            )}
            {renderEntryDetails(entry)}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default PatientPage;
