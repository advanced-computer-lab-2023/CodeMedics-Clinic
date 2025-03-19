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
import Message from 'src/components/Miscellaneous/Message';

export const OverviewPackageInfoDetails = ({ curPackage }) => {

    const [me, setMe] = useState({});
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // console.log("curPackage", curPackage);
    useEffect(() => {
        axios
            .get(`http://localhost:8000/patient/getMe`, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setMe(res.data);
            })
            .catch((err) => {
                console.log(err);
                setShowError(true);
                setErrorMessage(err.response.data.message);
            });
    }, []);

    const subscribeHealthPackage = () => {
        router.push('/user/PackageMyPay?packageName=' + curPackage.Name + '&packagePrice=' + curPackage.Price);
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
                setShowError(true);
                setErrorMessage(err.response.data.message);
            });
    }

    return (
        <Card>
            <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
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
            {(Object.keys(me).length !== 0 && me.HealthPackage.status === 'EndDateCancelled' || Object.keys(me).length !== 0 && me.HealthPackage.membership !== curPackage.Name && me.HealthPackage.membership !== "Free") ?
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
