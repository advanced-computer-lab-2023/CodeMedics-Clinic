import Head from 'next/head';
import { Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/system';
import Cookies from 'js-cookie';

const now = new Date();

const Page = () => {

    const username = Cookies.get('username');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
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
                                    <Card sx={{ m: 2, p: 2 }} onClick={() => {setSelectedChat(chat);}}>
                                        <Stack direction="row" >
                                            <Avatar alt={doctor.FirstName + " " + doctor.LastName} src={doctor.Picture == null ? `/assets/avatars/${index % 16}.png` : doctor.Picture} />
                                            <Stack sx={{ ml: 2, }}>
                                                <Typography variant='body1' >
                                                    {doctor.FirstName + " " + doctor.LastName}
                                                </Typography>
                                                {chat.latestMessage && <Typography variant="caption" color="textSecondary">
                                                    {chat.latestMessage.sender == username ? "You: " : chat.latestMessage.sender + ": "+ chat.latestMessage.content}
                                                </Typography>}
                                            </Stack>
                                        </Stack>
                                    </Card>
                                )
                            })}
                        </Box>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    {selectedChat == null ?
                        <Stack>
                            <Avatar src={`/assets/errors/error-404.png`} sx={{height: 140 , width:140 ,p:2 , mt:25 , ml:39}}/> 
                            <Typography variant='subtitle2' sx={{ mb: 4, ml: 33, fontSize: 16 }}>
                            Start meaningful conversations!
                            </Typography>
                        </Stack> :
                        <Stack>
                            <Stack sx={{m: 2}} direction="row">
                                <Avatar alt={selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName} src={selectedChat.doctor.Picture == null ? `/assets/avatars/0.png` : selectedChat.doctor.Picture} />
                                <Stack sx={{ ml: 2, mt:0.5, width:650}}>
                                    <Typography variant='body1' >
                                        {selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName}
                                    </Typography>
                                    <Typography variant='caption' color="textSecondary">
                                        {selectedChat.doctor.Speciality}
                                    </Typography>
                                </Stack>
                                <Tooltip title="Video Call">
                                    <IconButton >
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <CameraIcon />
                                        </SvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Divider sx={{width: 785}}/>
                            <Box sx={{height: 435, width: 785, overflow: 'auto'}}>
                            </Box>
                            <Divider sx={{width: 785}}/>
                            <Stack sx={{ml: 2 , mt:2 }} direction="row">
                            <Avatar alt={selectedChat.user.FirstName + " " + selectedChat.user.LastName} src={selectedChat.user.Picture == null ? `/assets/avatars/2.png` : selectedChat.user.Picture} />
                                <OutlinedInput
                                    defaultValue=""
                                    sx = {{ml:2 , height:40 , width: 580 , mr: 5}}
                                    
                                    onChange={(str) => {
                                    }}
                                    placeholder="Leave a message"
                                />
                                <Tooltip title="Send">
                                    <IconButton >
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <PaperAirplaneIcon />
                                        </SvgIcon>
                                    </IconButton>
                                </Tooltip>
                                </Stack>
                        </Stack>
                    }
                </Stack>
            </Box>
        </>
    );
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
