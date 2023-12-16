import { Avatar, Box, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography, Divider } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { ChatSidebarSearch } from './ChatSidebarSearch';
import { Scrollbar } from 'src/components/scrollbar';
import { ChatItem } from './ChatItem';

export const ChatSidebar = (props) => {
    const { chats, selectedChat, setSelectedChat, username, getMessages } = props;

    return (
        <div>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{ p: 2 }}
            >
                <Typography
                    variant="h5"
                    sx={{ flexGrow: 1 }}
                >
                    Chats
                </Typography>
            </Stack>
            <ChatSidebarSearch />
            <Box sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    height: 485
                }}>
                <Scrollbar sx={{ maxHeight: '100%' }}>
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{
                            listStyle: 'none',
                            m: 0,
                            p: 2,
                        }}
                    >
                        {chats && chats.map((chat, index) => {
                            const doctor = chat.doctor;
                            console.log(index);
                            return (
                                <ChatItem key={index} index={index} chat={chat} doctor = {doctor} selectedChat={selectedChat} setSelectedChat={setSelectedChat} username={username} getMessages={getMessages} />
                            )
                        })}
                    </Stack>
                </Scrollbar>
            </Box>
        </div>
    );
};