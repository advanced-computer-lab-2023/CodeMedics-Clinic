import { useCallback, useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const OverviewPackageInfoDetails = ({ curPackage }) => {

    const [me, setMe] = useState({});
    const router = useRouter();

    useEffect(() => {
        axios
            .get(`http://localhost:8000/patient/getMe`, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setMe(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const subscribeHealthPackage = () => {
        axios(`http://localhost:8000/patient/subscribeHealthPackage`, {
            method: 'POST',
            data: {membership: curPackage.Name},
            withCredentials: true
        })
            .then((res) => {
                router.push('/user/packages');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const unsubscribeHealthPackage = () => {
        axios(`http://localhost:8000/patient/unsubscribeHealthPackage`, {
            method: 'POST',
            withCredentials: true
        })
            .then((res) => {
                router.push('/user/packages');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Card>
            <CardHeader
                title="Package Info"
            />
            <CardContent sx={{ pt: 0 }}>
                {Object.keys(curPackage).length !== 0 &&
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
                                    label="Package Price"
                                    name="curPackagePrice"
                                    value={curPackage.Price}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Session Discount"
                                    name="SessionDiscount"
                                    value={curPackage.SessionDiscount}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Medicine Discount"
                                    name="MedicineDiscount"
                                    value={curPackage.MedicineDiscount}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Family Discount"
                                    name="FamilyDiscount"
                                    value={curPackage.FamilyDiscount}
                                />
                            </Grid>
                        </Grid>
                    </Box>}
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                {Object.keys(me).length !== 0 && me.HealthPackage.status === 'EndDateCancelled' ?
                    <Button variant="contained" disabled>
                        Subscribe
                    </Button>
                    : Object.keys(me).length !== 0 && me.HealthPackage.status === 'Inactive' ?
                    <Button variant="contained" onClick={subscribeHealthPackage}>
                        Subscribe
                    </Button> :
                    <Button variant="contained" onClick={unsubscribeHealthPackage}>
                        Unsubscribe
                    </Button>}
            </CardActions>
        </Card>
    );
};
