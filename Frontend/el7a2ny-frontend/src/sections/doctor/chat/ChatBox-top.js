import { Stack, Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import { useRouter } from 'next/navigation';

export const ChatBoxTop = (props) => {
    const router = useRouter();
    const { selectedChat } = props;
    return(
        <Stack sx={{ m: 2 }} direction="row" justifyContent="space-between">
                <Stack direction="row" >
                    <Avatar alt={selectedChat.patient.FirstName + " " + selectedChat.patient.LastName} src={selectedChat.patient.Picture == null ? `/assets/avatars/0.png` : selectedChat.patient.Picture} />
                    <Stack sx={{ ml: 2, mt: 0.5 }} >
                        <Typography variant='body1' >
                            {selectedChat.patient.FirstName + " " + selectedChat.patient.LastName}
                        </Typography>
                    </Stack>
                </Stack>
                <Tooltip title="Video Call">
                <IconButton onClick={() => {router.push(`/doctor/videoCall?username=${selectedChat.patient.Username}`)}}>
                        <SvgIcon
                            color="action"
                            fontSize="small"
                        >
                            <CameraIcon />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Stack>
    );
};