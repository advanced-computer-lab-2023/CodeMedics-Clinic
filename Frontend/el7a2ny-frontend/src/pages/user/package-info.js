import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { OverviewPackageInfo } from 'src/sections/overview/overview-package-info';
import { OverviewPackageInfoDetails } from 'src/sections/overview/overview-package-info-details';
import Message from 'src/components/Message';

const Page = () => {

    const params = new URLSearchParams(window.location.search);
    const packageName = params.get('packageName');

    const [myPackage, setPackage] = useState({});
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:8000/patient/getPackage?packageName=${packageName}`)
            .then((res) => {
                console.log(res.data);
                setPackage(res.data);
            })
            .catch((err) => {
                console.log(err);
                setShowError(true);
                setErrorMessage(err.response.data.message);
            });
    }, []);

    return (
        <>
            <Head>
                <title>
                    {myPackage.Name}
                </title>
            </Head>
            <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <div>
                            <Typography variant="h4">
                                {myPackage.Name} Package
                            </Typography>
                        </div>
                        <div>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={4}
                                >
                                    <OverviewPackageInfo curPackage={myPackage} />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={8}
                                >
                                    <OverviewPackageInfoDetails curPackage={myPackage} />
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
