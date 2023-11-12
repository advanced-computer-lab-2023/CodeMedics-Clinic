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
import axios from 'axios';
import { useRouter } from 'next/router';

export const AccountProfileDetailsPatient = ({values, setValues}) => {

  const router = useRouter();
  
  console.log("HERE",values);

  const solve = (prevState, name, value) => {
    const tmp = name.split('.');
    if(tmp.length === 1) {
      return {
        ...prevState,
        [name]: value
      };
    }

    console.log(prevState);

    return {
      ...prevState,
      [tmp[0]]: {
        ...prevState[tmp[0]],
        [tmp[1]]: value
      }
    }
  }

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => solve(prevState, event.target.name, event.target.value));
    },
    []
  );

  const handleSubmit = () => {
      console.log("SUBMITTING", values);
      axios.patch('http://localhost:8000/patient/updateMe', values, {withCredentials: true})
        .then(() => {
          router.push('/user/doctors');
        })
        .catch((err) => {
          console.log(err);
        });
    };

  return (
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
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
                  name="FirstName"
                  onChange={handleChange}
                  required
                  value={values.FirstName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="LastName"
                  onChange={handleChange}
                  required
                  value={values.LastName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="Username"
                  onChange={handleChange}
                  disabled
                  value={values.Username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="Email"
                  onChange={handleChange}
                  required
                  value={values.Email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  type="password"
                  fullWidth
                  label="Password"
                  name="Password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="Number"
                  onChange={handleChange}
                  type="number"
                  value={values.Number}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  type="date"
                  fullWidth
                  label="Date of birth"
                  name="DateOfBirth"
                  onChange={handleChange}
                  required
                  value={values.DateOfBirth}
                />
              </Grid>              
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  name="EmergencyContact.Name"
                  onChange={handleChange}
                  required
                  value={values.EmergencyContact.Name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Emergency Contact Number"
                  name="EmergencyContact.Number"
                  onChange={handleChange}
                  required
                  value={values.EmergencyContact.Number}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Emergency Contact Relation"
                  name="EmergencyContact.Relation"
                  onChange={handleChange}
                  required
                  value={values.EmergencyContact.Relation}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Save details
          </Button>
        </CardActions>
      </Card>
  );
};
