import Head from 'next/head';
import { Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { ChatSidebar } from 'src/sections/doctor/chat/ChatSidebar';
import { ChatBox } from 'src/sections/doctor/chat/ChatBox';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/system';
import Cookies from 'js-cookie';
import socket from 'src/components/socket';

const now = new Date();

const Page = () => {

    const username = Cookies.get('username');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:8000/chat/getDoctorChats', { withCredentials: true })
            .then((response) => {
                console.log(response.data.chats);
                setChats(response.data.chats);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    const changeChatAndMessages = (message) => {
        const tmp = [];
        for(let i = 0; i < chats.length; i++) {
            if(chats[i].chat._id == message.chat) {
                tmp.push(chats[i]);
                tmp[i].chat.latestMessage = message;
                tmp[i].latestMessage = message;
            }
            else{
                tmp.push(chats[i]);
            }
        }
        setChats(tmp);
        if(selectedChat && selectedChat.chat._id == message.chat) {
            setMessages([...messages, message]);
        }
    };

    socket.on('newMessage', (message) => {
        changeChatAndMessages(message);
    });

     const getMessages = (chatId) => {
        if(selectedChat && chatId == selectedChat.chat._id) return;
        axios.get(`http://localhost:8000/chat/getMessages?chatId=${chatId}`, { withCredentials: true })
            .then((response) => {
                setMessages(response.data.messages);
            }).catch((error) => {
                console.log(error);
            });
     };

     const sendMessage = (message) => {
        const body = {
            sender: username,
            content: message,
            chatId: selectedChat.chat._id,
        };
        axios.post("http://localhost:8000/chat/sendMessage", body , { withCredentials: true })
            .then((response) => {
                changeChatAndMessages(response.data.newMessage);
                socket.emit('newMessage', {message: response.data.newMessage, receiver: selectedChat.patient.Username});
            }).catch((error) => {
                console.log(error);
            });
     };

    return (
        <>
            <Head>
                <title>El7a2ny Clinic</title>
            </Head>
            <Box>
                <Divider />
                <Stack direction="row" >
                    <ChatSidebar chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} username={username} getMessages={getMessages}/>
                    <Divider orientation="vertical" flexItem />
                    {selectedChat == null ?
                        <Stack>
                            <Avatar src={`/assets/errors/error-404.png`} sx={{height: 140 , width:140 ,p:2 , mt:25 , ml:39}}/> 
                            <Typography variant='subtitle2' sx={{ mb: 4, ml: 33, fontSize: 16 }}>
                            Start meaningful conversations!
                            </Typography>
                        </Stack> :
                        <ChatBox selectedChat={selectedChat} messages={messages} username={username} sendMessage={sendMessage}/>
                    }
                </Stack>
            </Box>
        </>
    );
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
