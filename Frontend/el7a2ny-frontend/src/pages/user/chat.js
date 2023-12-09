import Head from 'next/head';
import { Box, Container, Divider, Unstable_Grid2 as Grid, Typography , OutlinedInput , InputAdornment , SvgIcon } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/system';

const now = new Date();

const Page = () => {

    const [filterSpeciality, setFilterSpeciality] = useState([]);
    const [searchDoctor, setSearchDoctor] = useState([]);
    const [searchSpeciality, setSearchSpeciality] = useState([]);
    const [data, setData] = useState([]);
    const [specialities, setSpecialities] = useState([])
    const [filterDate, setFilterDate] = useState([]);
    const [doctors, setDoctors] = useState([]);

    return (
        <>
            <Head>
                <title>El7a2ny Clinic</title>
            </Head>
            <Box>
                <Divider />
                <Stack direction="row" >
                    <Stack sx = {{m: 2 , height: 550 , width: 300}}>
                        <Typography variant='h4' sx={{ mb: 4,  fontSize: 21 }}>
                            Chats
                        </Typography>
                        <OutlinedInput
                            defaultValue=""
                            onChange={(str) => {
                            }}
                            placeholder = "Search Doctor"
                            startAdornment={(
                                <InputAdornment position="start">
                                    <SvgIcon
                                        color="action"
                                        fontSize="small"
                                    >
                                        <MagnifyingGlassIcon />
                                    </SvgIcon>
                                </InputAdornment>
                            )}
                        />  
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                </Stack>
            </Box>
        </>
    );
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
