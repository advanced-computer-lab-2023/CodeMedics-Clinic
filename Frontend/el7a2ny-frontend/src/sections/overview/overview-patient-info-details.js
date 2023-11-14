import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const OverviewPatientInfoDetails = ({patient}) => {
  

  return (
    <Card>
      <CardHeader
        title={patient.FirstName + "'s Profile"}
      />
      <CardContent sx={{ pt: 0 }}>
        {Object.keys(patient).length !== 0 && 
        <Box sx={{ m: -1.5 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                value={patient.FirstName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                value={patient.LastName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={patient.Email}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={patient.DateOfBirth}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  //onClick={handleScheduleFollowUp}
                >
                  Schedule a Follow Up
                </Button>
              </Grid>

              {/* View Health Records button */}
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  //onClick={handleViewHealthRecords}
                >
                  View Health Records
                </Button>
            </Grid>
          </Grid>
        </Box>}
      </CardContent>
      <Divider />
    </Card>
  );
};
