import { useCallback, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import {
    Alert,
    Box,
    Button,
    FormHelperText,
    Link,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
    const router = useRouter();
    const auth = useAuth();
    const [method, setMethod] = useState('Username');

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
            submit: null
        },
        validationSchema: Yup.object({
            password: Yup
                .string()
                .max(35, 'Password must be at most 35 characters')
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required')
                // password must have at least one digit and at least one capital letter
                .matches(/^(?=.*\d)(?=.*[A-Z]).+$/, 'Password must have at least one Capital Character and one Digit'),
            confirmPassword: Yup
                .string()
                .min(8, 'Password must be at least 8 characters')
                .max(35, 'Password must be at most 35 characters')
                .required('Confirmation Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: async (values, helpers) => {
            const username = new URLSearchParams(window.location.search).get('username');
            if (values.password !== values.confirmPassword) {
                console.log(123);
            } else {
                try {
                    const response = await fetch('http://localhost:8000/patient/changePassword', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            newPassword: values.password,
                        }),
                    });
                    if (response.ok) {
                        console.log('Password updated successfully');
                        router.push('/auth/login');
                    } else {
                        console.error('Failed to update password');
                    }
                } catch (error) {
                    console.error('An error occurred while updating the password', error);
                }
            }
        }
    });

    const handleMethodChange = useCallback(
        (event, value) => {
            setMethod(value);
        },
        []
    );

    const handleSkip = useCallback(
        () => {
            auth.skip();
            router.push('/');
        },
        [auth, router]
    );

    return (
        <>
            <Head>
                <title>
                    Reset Password
                </title>
            </Head>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
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
                        <Stack
                            spacing={1}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="h4">
                                Reset your password
                            </Typography>

                        </Stack>
                        <form noValidate
                            onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
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
                                    error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                                    fullWidth
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    label="Password (Confirm)"
                                    name="confirmPassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.confirmPassword}
                                />
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Reset
                                </Button>
                            </Stack>
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <AuthLayout>
        {page}
    </AuthLayout>
);

export default Page;
