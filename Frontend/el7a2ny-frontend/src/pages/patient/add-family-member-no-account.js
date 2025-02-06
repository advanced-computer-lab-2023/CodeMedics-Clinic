import Head from 'next/head';
import { Card, CardContent, Avatar, Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { AddFamilyMemberNoAccountInfo } from 'src/sections/user/add-family-member-no-account-info';

const Page = () => {

    return (
        <>
            <Head>
                Add Family Member
            </Head>
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
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={8}
                                >
                                    <AddFamilyMemberNoAccountInfo />
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
