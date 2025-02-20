import Head from "next/head";
import { Box, Divider, Typography, Avatar } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { ChatSidebar } from "src/sections/user/chat/ChatSidebar";
import { ChatBox } from "src/sections/user/chat/ChatBox";
import socket from "src/components/socket";

import axios from "axios";
import { useState, useEffect } from "react";
import { Stack } from "@mui/system";
import Cookies from "js-cookie";
import Message from "src/components/Miscellaneous/Message";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";

const Page = () => {
  const username = Cookies.get("username");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/chats`,
    setData: setChats,
    setLoading,
    setShowError,
    setError,
  });

  const changeChatAndMessages = (message) => {
    const tmp = chats.map((chat) => {
      if (chat._id == message.chat) {
        return {
          chat: { latestMessage: message, updatedAt: message.createdAt },
          latestMessage: message,
        };
      }
      return chat;
    });
    tmp.sort((a, b) => {
      if (a.chat.updatedAt > b.chat.updatedAt) return -1;
      if (a.chat.updatedAt < b.chat.updatedAt) return 1;
      return 0;
    });
    setChats(tmp);
    if (selectedChat && selectedChat.chat._id == message.chat) {
      setMessages([...messages, message]);
    }
  };

  socket.off("newMessage").on("newMessage", (message) => {
    changeChatAndMessages(message);
  });

  socket.off("newMessagePharmacy").on("newMessagePharmacy", (message) => {
    changeChatAndMessages(message);
  });

  const getMessages = (chatId) => {
    if (selectedChat && chatId == selectedChat.chat._id) return;
    axios
      .get(`${BACKEND_ROUTE}/patients/chats/${chatId}/messages`, { withCredentials: true })
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setError(error.response.data.message);
      });
  };

  const sendMessage = (message) => {
    const body = {
      sender: username,
      content: message,
    };
    axios
      .post(`${BACKEND_ROUTE}/patients/chats/${selectedChat.chat._id}/messages`, body, {
        withCredentials: true,
      })
      .then((response) => {
        changeChatAndMessages(response.data.newMessage);
        if (selectedChat.pharmacy) {
          socket.emit("newMessagePharmacy", {
            message: response.data.newMessage,
            receiver: Cookies.get("username"),
            sendingToPharmacy: true,
          });
        } else {
          socket.emit("newMessage", {
            message: response.data.newMessage,
            receiver: selectedChat.doctor.Username,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setError(error.response.data.message);
      });
  };

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      <Box>
        <Divider />
        <Stack direction="row">
          <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            username={username}
            getMessages={getMessages}
          />
          <Divider orientation="vertical" flexItem />
          {selectedChat == null ? (
            <Stack>
              <Avatar
                src={`/assets/errors/error-404.png`}
                sx={{ height: 140, width: 140, p: 2, mt: 25, ml: 39 }}
              />
              <Typography variant="subtitle2" sx={{ mb: 4, ml: 33, fontSize: 16 }}>
                Start meaningful conversations!
              </Typography>
            </Stack>
          ) : (
            <ChatBox
              selectedChat={selectedChat}
              messages={messages}
              username={username}
              sendMessage={sendMessage}
            />
          )}
        </Stack>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
