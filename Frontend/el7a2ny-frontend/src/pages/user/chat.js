import Head from 'next/head';
import { Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import { ChatSider } from 'src/sections/user/chat/ChatSider';
import { ChatBox } from 'src/sections/user/chat/ChatBox';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/system';
import Cookies from 'js-cookie';

const now = new Date();

const Page = () => {

    const username = Cookies.get('username');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState(["a","a","a","a","a","a","a","a","a","a","a","a","a","a","a"]);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:8000/chat/getPatientChats', { withCredentials: true })
            .then((response) => {
                console.log(response.data.chats);
                setChats(response.data.chats);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <Head>
                <title>El7a2ny Clinic</title>
            </Head>
            <Box>
                <Divider />
                <Stack direction="row" >
                    <ChatSider chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} username={username}/>
                    <Divider orientation="vertical" flexItem />
                    {selectedChat == null ?
                        <Stack>
                            <Avatar src={`/assets/errors/error-404.png`} sx={{height: 140 , width:140 ,p:2 , mt:25 , ml:39}}/> 
                            <Typography variant='subtitle2' sx={{ mb: 4, ml: 33, fontSize: 16 }}>
                            Start meaningful conversations!
                            </Typography>
                        </Stack> :
                        <ChatBox selectedChat={selectedChat} messages={messages} />
                    }
                </Stack>
            </Box>
        </>
    );
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
