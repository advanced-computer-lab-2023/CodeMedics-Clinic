import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Cookies from 'js-cookie';
import axios from 'axios';
import DocumentArrowUpIcon from '@heroicons/react/24/solid/DocumentArrowUpIcon';
import FileSaver from 'file-saver';

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

export const OverviewMedicalRecords = (props) => {
    const router = useRouter();
    const { medicalRecords } = props;

    const username = Cookies.get('username');

    const removeMedicalRecord = (documentId) => {
        axios
            .delete(`http://localhost:8000/patient/${username}/MedicalHistory/${documentId}`, {
                withCredentials: true,
            })
            .then(response => {
                console.log(response);
                router.refresh();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const addMedicalRecord = (documentId) => {
    const formData = new FormData();
    formData.append('document', documentId);

    axios.post(`http://localhost:8000/patient/${username}/MedicalHistoryUpload`, formData, {
        withCredentials: true,
    })
    .then(response => {
        console.log(response);
        router.refresh();
    })
    .catch(error => {
        console.log(error);
    });
};

    return (
        <CardContent>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={2}
            >
                {medicalRecords.map((medicalRecord, index) => (
                    <Card
                        key={medicalRecord._id}
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
                                    src={`/assets/google-docs.png`}
                                    sx={{
                                        height: 120,
                                        width: 120
                                    }}    
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={medicalRecord.filename || 'No Filename'}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItem>
                        <Stack direction="row">
                            <CardActions>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        FileSaver.saveAs(`/uploads/${medicalRecord.filename}`, `${medicalRecord.filename}`);
                                    }}
                                >
                                    Download
                                </Button>
                            </CardActions>
                        </Stack>
                    </Card>
                ))}
            </Box>
        </CardContent>
    );
};

OverviewMedicalRecords.propTypes = {
    medicalRecords: PropTypes.array,
    sx: PropTypes.object,
};

