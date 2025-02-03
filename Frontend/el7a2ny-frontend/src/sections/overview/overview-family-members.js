import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Cookies from 'js-cookie';
import axios from 'axios';
import Message from 'src/components/Miscellaneous/Message';

import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack
} from '@mui/material';

export const OverviewFamilyMembers = (props) => {
    const router = useRouter();
    const { familyMembers, familyMembersNoAccount } = props;
    const {showError, setShowError} = useState(false);
    const {errorMessage, setErrorMessage} = useState("");


    const removeFamilyMember = (familyMemberId) => {
        axios('http://localhost:8000/patient/familyMembers', {
            method: 'DELETE',
            data: { familyMemberId },
            withCredentials: true
        }).then(response => {
            console.log(response);
            router.refresh();
        }).catch(error => {
            console.log(error);
            setShowError(true);
            setErrorMessage(error.response.data.message);
        });
    };

    const removeFamilyMemberNoAccount = (familyMemberId) => {
        axios('http://localhost:8000/patient/familyMembersNoAccount', {
            method: 'DELETE',
            data: { familyMemberId },
            withCredentials: true
        }).then(response => {
            console.log(response);
            router.refresh();
        }).catch(error => {
            console.log(error);
            setShowError(true);
            setErrorMessage(error.response.data.message);
        });
    };

    return (
        <CardContent>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={2}
            >
                <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
                {familyMembers.map((familyMember, index) => {
                    return (
                        <Card
                            key={familyMember._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                textAlign: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ListItem
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <ListItemAvatar>
                                    <Box
                                        component="img"
                                        src={`/assets/avatars/${index % 16}.png`}
                                        sx={{
                                            borderRadius: '50%',
                                            backgroundColor: 'neutral.200',
                                            height: 120,
                                            width: 120,
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={familyMember.familyMember.FirstName + ' ' + familyMember.familyMember.LastName}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                            <Stack direction="row">
                                <CardActions>
                                    <ListItemText
                                        primary={"Relation: " + familyMember.relation}
                                        primaryTypographyProps={{ variant: 'subtitle1' }}
                                        secondaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </CardActions>
                            </Stack>
                            <Stack direction="row">
                                <CardActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        onClick={() => { removeFamilyMember(familyMember.familyMember._id) }}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Stack>
                        </Card>
                    );
                })}
                {familyMembersNoAccount.map((familyMember, index) => {
                    return (
                        <Card
                            key={familyMember._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                textAlign: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ListItem
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <ListItemAvatar>
                                    {familyMember.Picture ? (
                                        <Box
                                            component="img"
                                            src={familyMember.Picture}
                                            sx={{
                                                borderRadius: '70%',
                                                height: 130,
                                                width: 130,
                                                objectFit: 'cover',
                                                margin: '0 auto',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            component="img"
                                            src={`/assets/avatars/${index % 16}.png`}
                                            sx={{
                                                borderRadius: '50%',
                                                backgroundColor: 'neutral.200',
                                                height: 120,
                                                width: 120,
                                            }}
                                        />
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={familyMember.Name}
                                    primaryTypographyProps={{ variant: 'subtitle1' }}
                                    secondaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                            <Stack direction="row">
                                <CardActions>
                                    <ListItemText
                                        primary={"Relation: " + familyMember.Relationship}
                                        primaryTypographyProps={{ variant: 'subtitle1' }}
                                        secondaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </CardActions>
                            </Stack>
                            <Stack direction="row">
                                <CardActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        onClick={() => { removeFamilyMemberNoAccount(familyMember._id) }}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Stack>
                        </Card>
                    );
                })}
            </Box>
            <Divider />
        </CardContent>
    );
};

OverviewFamilyMembers.propTypes = {
    products: PropTypes.array,
    sx: PropTypes.object,
};
