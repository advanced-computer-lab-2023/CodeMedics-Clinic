import { Avatar, Box, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography, Divider } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

export const ChatSider = (props) => {
    const { chats, selectedChat, setSelectedChat, username } = props;

    return (
        <Stack sx={{ m: 2, height: 550, width: 300 }}>
            <Typography variant='h4' sx={{ mb: 4, fontSize: 21 }}>
                Chats
            </Typography>
            <OutlinedInput
                defaultValue=""
                onChange={(str) => {
                }}
                placeholder="Search Doctor"
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
            <Box>
                {chats && chats.map((chat, index) => {
                    const doctor = chat.doctor;
                    return (
                        <Stack sx={{
                            borderRadius: 2.5,
                            cursor: 'pointer',
                            px: 3,
                            py: 2,
                            m: 2,
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            },
                            ...(selectedChat && selectedChat.doctor.Username === doctor.Username && {
                                backgroundColor: 'action.hover'
                            })
                        }} onClick={() => { setSelectedChat(chat); }}>
                            <Stack direction="row" >
                                <Avatar alt={doctor.FirstName + " " + doctor.LastName} src={doctor.Picture == null ? `/assets/avatars/${index % 16}.png` : doctor.Picture} />
                                <Stack sx={{ ml: 2, }}>
                                    <Typography variant='body1' >
                                        {doctor.FirstName + " " + doctor.LastName}
                                    </Typography>
                                    {chat.latestMessage && <Typography variant="caption" color="textSecondary">
                                        {chat.latestMessage.sender == username ? "You: " : chat.latestMessage.sender + ": " + chat.latestMessage.content}
                                    </Typography>}
                                </Stack>
                            </Stack>
                        </Stack>
                    )
                })}
            </Box>
        </Stack>
    );
};