import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  // Create state variables to manage the selected form
  const [selectedForm, setSelectedForm] = useState('patient'); // Default to 'patient'

  // Create state variables to manage the visibility of each form
  const [isPatientFormVisible, setIsPatientFormVisible] = useState(false); // Initially set to false
  const [isPharmacistFormVisible, setIsPharmacistFormVisible] = useState(false); // Initially set to false

  // Create formik objects for patient and pharmacist forms
 // Initialize the patient form with an empty emergencyContact object
 const [error, setError] = useState('');

// Create formik objects for patient and pharmacist forms
// Initialize the patient form with an empty emergencyContact object
const patientFormik = useFormik({
  initialValues: {
    username: '',
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: 'male',
    mobileNumber: '',
    emergencyContact: {
      fullName: '',
      mobileNumber: '',
      relation: '',
    },
  },
  validationSchema: Yup.object({
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    dob: Yup.string().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    'emergencyContact.fullName': Yup.string().required('Emergency Contact Full Name is required'),
    'emergencyContact.mobileNumber': Yup.string().required('Emergency Contact Mobile Number is required'),
    'emergencyContact.relation': Yup.string().required('Emergency Contact Relation is required'),
  }),
  onSubmit : async (values, helpers) => { // Call the handleFormSubmit function
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientFormik.values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Username/Email already exists. Please choose another one.');
        }
      })
      .then((data) => {
        // Handle successful response here, if needed
        console.log(data);
        alert('Request sent successfully!');
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error:', error);
        setError('Error occurred: ' + error.message);
      });
    }
});

const formik = useFormik({
  initialValues: {
    username: '',
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: 'male',
    hourlyRate: '',
    affiliation: '',
    educationalBackground: '',
    submit: null
  },
  validationSchema: Yup.object({
    username: Yup
      .string()
      .max(255)
      .required('Username is required'),
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    email: Yup
      .string()
      .email('Must be a valid email')
      .max(255)
      .required('Email is required'),
    password: Yup
      .string()
      .max(255)
      .required('Password is required'),
    dob: Yup
      .date()
      .required('Date of birth is required'),
    hourlyRate: Yup
      .number()
      .required('Hourly rate is required'),
    affiliation: Yup
      .string()
      .required('Affiliation is required'),
      educationalBackground: Yup
      .string()
      .required('Degree is required')  
  }),
  onSubmit: async (values, helpers) => {
    fetch('http://localhost:3000/Pharmregister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Username/Email already exists. Please choose another one.');
        }
      })
      .then((data) => {
        // Handle successful response here, if needed
        console.log(data);
        alert('Request sent successfully!');
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error:', error);
        setError('Error occurred: ' + error.message);
      });
  }
});

  const handleFormToggle = (formType) => {
    setSelectedForm(formType);

    // Show the selected form and keep the other form hidden
    if (formType === 'patient') {
      setIsPatientFormVisible(true);
      setIsPharmacistFormVisible(false);
    } else if (formType === 'pharmacist') {
      setIsPatientFormVisible(false);
      setIsPharmacistFormVisible(true);
    }
  };

  return (
    <>
      <Head>
        <title>Register </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>

            {/* Buttons to switch between forms and show/hide the forms */}
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              variant={selectedForm === 'patient' ? 'contained' : 'outlined'}
              onClick={() => handleFormToggle('patient')}
            >
              Register as Patient
            </Button>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3,  mb: 3 }}
              variant={selectedForm === 'pharmacist' ? 'contained' : 'outlined'}
              onClick={() => handleFormToggle('pharmacist')}
            >
              Register as Pharmacist
            </Button>

            {/* Conditionally render the forms based on the selected form */}
            {isPatientFormVisible && (
              <form onSubmit={patientFormik.handleSubmit}>
                {/* Patient form inputs */}
                <Stack spacing={3}>
                <TextField
                  error={!!(patientFormik.touched.username && patientFormik.errors.username)}
                  fullWidth
                  helperText={patientFormik.touched.username && patientFormik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values.username}
                />

                <TextField
                  error={!!(patientFormik.touched.name && patientFormik.errors.name)}
                  fullWidth
                  helperText={patientFormik.touched.name && patientFormik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values.name}
                />

                <TextField
                  error={!!(patientFormik.touched.email && patientFormik.errors.email)}
                  fullWidth
                  helperText={patientFormik.touched.email && patientFormik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values.email}
                />

                <TextField
                  error={!!(patientFormik.touched.password && patientFormik.errors.password)}
                  fullWidth
                  helperText={patientFormik.touched.password && patientFormik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  type="password"
                  value={patientFormik.values.password}
                />

                <TextField
                  error={!!(patientFormik.touched.dob && patientFormik.errors.dob)}
                  fullWidth
                  helperText={patientFormik.touched.dob && patientFormik.errors.dob}
                  label="Date of Birth"
                  name="dob"
                  onBlur={patientFormik.handleBlur}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value.length <= 10) { // Limit the total length to 10 characters
                      // Allow only digits (0-9) in the "yyyy" part
                      const yyyy = value.slice(0, 4).replace(/[^0-9]/g, '');
  
                      // Ensure "mm" and "dd" are not affected
                      const mmdd = value.slice(4);
  
                      // Combine the parts and format
                      const formattedValue = `${yyyy}${mmdd}`;
  
                      // Update the formik value
                      formik.setFieldValue("dateOfBirth", formattedValue);
                    }
                  }}
                  type="date"
                  value={patientFormik.values.dob}
                  InputLabelProps={{ shrink: true }}
                />

                <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    onBlur={patientFormik.handleBlur}
                    onChange={patientFormik.handleChange}
                    value={patientFormik.values.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  
                <TextField
                  error={!!(patientFormik.touched.mobileNumber && patientFormik.errors.mobileNumber)}
                  fullWidth
                  helperText={patientFormik.touched.mobileNumber && patientFormik.errors.mobileNumber}
                  label="Mobile Number"
                  name="mobileNumber"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values.mobileNumber}
                />

                <TextField
                  error={!!(patientFormik.touched['emergencyContact.fullName'] && patientFormik.errors['emergencyContact.fullName'])}
                  fullWidth
                  helperText={patientFormik.touched['emergencyContact.fullName'] && patientFormik.errors['emergencyContact.fullName']}
                  label="Emergency Contact Full Name"
                  name="emergencyContact.fullName"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values['emergencyContact.fullName']}
                />

                <TextField
                  error={!!(patientFormik.touched['emergencyContact.mobileNumber'] && patientFormik.errors['emergencyContact.mobileNumber'])}
                  fullWidth
                  helperText={patientFormik.touched['emergencyContact.mobileNumber'] && patientFormik.errors['emergencyContact.mobileNumber']}
                  label="Emergency Contact Mobile Number"
                  name="emergencyContact.mobileNumber"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values['emergencyContact.mobileNumber']}
                />

                <TextField
                  error={!!(patientFormik.touched['emergencyContact.relation'] && patientFormik.errors['emergencyContact.relation'])}
                  fullWidth
                  helperText={patientFormik.touched['emergencyContact.relation'] && patientFormik.errors['emergencyContact.relation']}
                  label="Emergency Contact Relation"
                  name="emergencyContact.relation"
                  onBlur={patientFormik.handleBlur}
                  onChange={patientFormik.handleChange}
                  value={patientFormik.values['emergencyContact.relation']}
                />
                 <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  //onClick={handlePatientFormSubmit}
                >
                  Submit
                </Button>


                  {/* ... */}
                </Stack>
                {/* ... */}
              </form>
            )}

            {isPharmacistFormVisible && (
              <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
              <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                  fullWidth
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  label="Date of Birth"
                  name="dateOfBirth"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 10) { // Limit the total length to 10 characters
                    // Allow only digits (0-9) in the "yyyy" part
                    const yyyy = value.slice(0, 4).replace(/[^0-9]/g, '');

                    // Ensure "mm" and "dd" are not affected
                    const mmdd = value.slice(4);

                    // Combine the parts and format
                    const formattedValue = `${yyyy}${mmdd}`;

                    // Update the formik value
                    formik.setFieldValue("dateOfBirth", formattedValue);
                  }
                }}
                  type="date"
                  value={formik.values.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
                <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    onBlur={patientFormik.handleBlur}
                    onChange={patientFormik.handleChange}
                    value={patientFormik.values.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                <TextField
                  error={!!(formik.touched.hourlyRate && formik.errors.hourlyRate)}
                  fullWidth
                  helperText={formik.touched.hourlyRate && formik.errors.hourlyRate}
                  label="Hourly Rate (EGP)"
                  name="hourlyRate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.hourlyRate}
                />
                <TextField
                  error={!!(formik.touched.affiliation && formik.errors.affiliation)}
                  fullWidth
                  helperText={formik.touched.affiliation && formik.errors.affiliation}
                  label="Affiliation"
                  name="affiliation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.affiliation}
                />
                <TextField
                  error={!!(formik.touched.educationalBackground && formik.errors.educationalBackground)}
                  fullWidth
                  helperText={formik.touched.educationalBackground && formik.errors.educationalBackground}
                  label="Degree"
                  name="degree"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.educationalBackground}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
            )}
             

            {/* ... your existing code ... */}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
