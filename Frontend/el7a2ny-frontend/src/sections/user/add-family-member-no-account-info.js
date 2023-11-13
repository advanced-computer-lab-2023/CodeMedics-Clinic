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
    Typography,
    MenuItem,
    Stack,
    Unstable_Grid2 as Grid
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';

export const AddFamilyMemberNoAccountInfo = () => {
    const Gender = [  
        {
          value: 'Male',
          label: 'Male',
        },
        {
          value: 'Female',
          label: 'Female',
        },
        {
          value: 'Other',
          label: 'Other'
        }
      ];2
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            Name: '',
            NationalId: '',
            Gender: '',
            DateOfBirth: '',
            Relationship: '',
        },
        validationSchema: Yup.object({
            Name: Yup
                .string()
                .max(255)
                .required('Name is required'),
            NationalId: Yup
                .string()
                .max(255)
                .required('National Id is required'),
            Relationship: Yup
                .string()
                .max(255)
                .required('Relationship is required'),
            DateOfBirth: Yup
                .date()
                .required('Date of birth is required'),
            Gender: Yup
                .string()
                .max(255)
                .required('Gender is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const body = {
                    "Name": values.Name,
                    "NationalId": values.NationalId,
                    "Gender": values.Gender,
                    "DateOfBirth": values.DateOfBirth,
                    "Relationship": values.Relationship
                };
                await axios('http://localhost:8000/patient/familyMembersNoAccount', {
                    method: 'POST',
                    data: body,
                    withCredentials: true
                })
                    .then((res) => {
                        if (res.status != 200) {
                            throw new Error(res.data.message);
                        }
                        router.push('/user/family-members');
                    })
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ Submit: err.response.data.message });
                helpers.setSubmitting(false);
                router.push('/user/family-members');
            }
        }
    });

    return (
        <form
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <Card>
                <CardHeader
                    subheader="Add new family member"
                    title="Add Family Member"
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
                                    error={!!(formik.touched.Name && formik.errors.Name)}
                                    fullWidth
                                    helperText={formik.touched.Name && formik.errors.Name}
                                    label="Name"
                                    name="Name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.Name}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    error={!!(formik.touched.NationalId && formik.errors.NationalId)}
                                    fullWidth
                                    helperText={formik.touched.NationalId && formik.errors.NationalId}
                                    label="National ID"
                                    name="NationalId"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.NationalId}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    error={!!(formik.touched.Relationship && formik.errors.Relationship)}
                                    fullWidth
                                    helperText={formik.touched.Relationship && formik.errors.Relationship}
                                    label="Relationship"
                                    name="Relationship"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.Relationship}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    error={!!(formik.touched.DateOfBirth && formik.errors.DateOfBirth)}
                                    fullWidth
                                    helperText={formik.touched.DateOfBirth && formik.errors.DateOfBirth}
                                    label="Date of Birth"
                                    name="DateOfBirth"
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
                                            formik.setFieldValue("DateOfBirth", formattedValue);
                                        }
                                    }}
                                    type="date"
                                    value={formik.values.DateOfBirth}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    sx={{ width: 500 }}
                                    name="Gender"
                                    select
                                    label="Gender"
                                    defaultValue=""
                                    helperText=""
                                    onChange={(event) => {
                                        formik.handleChange(event);
                                        formik.setFieldValue("Gender", event.target.value);
                                    }}
                                >
                                    {Gender.map((option) => (
                                        <MenuItem key={option.value} value={option.value} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}

