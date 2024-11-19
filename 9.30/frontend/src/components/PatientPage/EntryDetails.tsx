import { Typography } from '@mui/material';
import { Entry } from '../../types';
import HealthRatingBar from '../HealthRatingBar';

// Utility function to handle unexpected cases
const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

// Define the props, including getDiagnosisName function
interface EntryDetailsProps {
  entry: Entry;
  getDiagnosisName: (code: string) => string; // New prop to get diagnosis names
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, getDiagnosisName }) => {
  return (
    <div>
      <Typography variant="h6">{entry.date} - {entry.description}</Typography>
      <Typography variant="body2">Specialist: {entry.specialist}</Typography>

      {/* Display diagnosis codes if they exist */}
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {getDiagnosisName(code)}
            </li>
          ))}
        </ul>
      )}

      {/* Specific details for each entry type */}
      {(() => {
        switch (entry.type) {
          case "Hospital":
            return (
              <div>
                <Typography variant="body1">Discharge Date: {entry.discharge?.date}</Typography>
                <Typography variant="body1">Discharge Criteria: {entry.discharge?.criteria}</Typography>
              </div>
            );
          case "OccupationalHealthcare":
            return (
              <div>
                <Typography variant="body1">Employer: {entry.employerName}</Typography>
                {entry.sickLeave && (
                  <div>
                    <Typography variant="body1">Sick Leave Start: {entry.sickLeave.startDate}</Typography>
                    <Typography variant="body1">Sick Leave End: {entry.sickLeave.endDate}</Typography>
                  </div>
                )}
              </div>
            );
          case "HealthCheck":
            return (
              <div>
                <Typography variant="body1">Health Rating:</Typography>
                <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
              </div>
            );
          default:
            return assertNever(entry); // Exhaustive type checking
        }
      })()}
    </div>
  );
};

export default EntryDetails;
