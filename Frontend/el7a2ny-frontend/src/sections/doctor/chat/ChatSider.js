import { Avatar, Box, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography, Divider } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

export const ChatSider = (props) => {
    const { chats, selectedChat, setSelectedChat, username , getMessages } = props;

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
                    const patient = chat.patient;
                    // const subtitle = chat.latestMessage ? chat.latestMessage.sender == username ? "You: " : chat.latestMessage.sender + ": " + chat.latestMessage.content : "";
                    return (
                        <Stack
                        key={index}
                        sx={{
                            borderRadius: 2.5,
                            cursor: 'pointer',
                            px: 3,
                            py: 2,
                            m: 2,
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            },
                            ...(selectedChat && selectedChat.patient.Username === patient.Username && {
                                backgroundColor: 'action.hover'
                            })
                        }} onClick={() => { setSelectedChat(chat); getMessages(chat.chat._id); }}>
                            <Stack direction="row" >
                                <Avatar alt={patient.FirstName + " " + patient.LastName} src={patient.Picture == null ? `/assets/avatars/${index % 16}.png` : patient.Picture} />
                                <Stack sx={{ ml: 2, }}>
                                    <Typography variant='body1' >
                                        {patient.FirstName + " " + patient.LastName}
                                    </Typography>
                                    {chat.latestMessage && <Typography variant="caption" color="textSecondary">
                                        {chat.latestMessage.sender == username ? "Me: " : ""} {chat.latestMessage.content}
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