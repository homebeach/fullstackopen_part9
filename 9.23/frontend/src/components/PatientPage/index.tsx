import { Box, Table, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import HealthRatingBar from "../HealthRatingBar";
import { Patient } from '../../types';
import patientService from "../../services/patients";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to access the id from the URL

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
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientPage;
