import Head from "next/head";
import { Box, Divider } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { ChatSidebar } from "src/sections/user/chat/ChatSidebar";
import { ChatBox } from "src/sections/user/chat/ChatBox";
import socket from "src/components/socket";
import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import Cookies from "js-cookie";
import Message from "src/components/Miscellaneous/Message";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";
import LoadingSpinner from "src/components/Miscellaneous/LoadingSpinner";
import { GET, POST } from "src/project-utils/helper-functions";
import NoChat from "src/components/Miscellaneous/NoChat";

const Page = () => {
  const username = Cookies.get("username");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesCache, setMessagesCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/chats`,
    setData: setChats,
    setLoading,
    setShowError,
    setError,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        await getMessages(selectedChat.chat._id);
        if (messagesCache[selectedChat.chat._id]) setMessages(messagesCache[selectedChat.chat._id]);
      }
    };

    fetchMessages();
  }, [selectedChat, messagesCache]);

  for (let i = 0; i < chats.length; i++) {
    console.log("i", i, chats[i].latestMessage);
  }

  const updateChats = (message) => {
    const updatedChats = chats
      .map((chat) => {
        if (chat.chat._id == message.chat) {
          return {
            ...chat,
            chat: { latestMessage: message, updatedAt: message.createdAt },
            latestMessage: message,
          };
        }
        return chat;
      })
      .sort((a, b) => new Date(b.chat.updatedAt) - new Date(a.chat.updatedAt));
    setChats(updatedChats);
    if (messagesCache[message.chat]) {
      setMessagesCache((prev) => ({
        ...prev,
        [message.chat]: [...(prev[message.chat] || []), message],
      }));
    } else {
      GET({
        url: `${BACKEND_ROUTE}/patients/chats/${message.chat}/messages`,
        setData: (data) => {
          setMessagesCache((prev) => ({ ...prev, [message.chat]: data }));
        },
        setShowError,
        setError,
      });
    }
  };

  socket.off("newMessage").on("newMessage", (message) => {
    updateChats(message);
  });

  socket.off("newMessagePharmacy").on("newMessagePharmacy", (message) => {
    updateChats(message);
  });

  const getMessages = async (chatId) => {
    if (chatId && !messagesCache[chatId]) {
      GET({
        url: `${BACKEND_ROUTE}/patients/chats/${chatId}/messages`,
        setData: (data) => {
          setMessagesCache((prev) => ({ ...prev, [chatId]: data }));
        },
        setShowError,
        setError,
      });
    }
  };

  const sendMessage = (message) => {
    const body = {
      sender: username,
      content: message,
    };

    console.log("message", message);

    POST({
      url: `${BACKEND_ROUTE}/patients/chats/${selectedChat.chat._id}/messages`,
      body,
      setShowError,
      setError,
      updater: () => {
        const newMessage = {
          chat: selectedChat.chat._id,
          sender: body.sender,
          content: body.content,
        };
        updateChats(newMessage);
        const eventName = selectedChat.pharmacy ? "newMessagePharmacy" : "newMessage";
        const payload = selectedChat.pharmacy
          ? { message: newMessage, receiver: Cookies.get("username"), sendingToPharmacy: true }
          : { message: newMessage, receiver: selectedChat.doctor.username };

        socket.emit(eventName, payload);
      },
    });
  };

  console.log("chat", selectedChat, messages, messagesCache);

  if (loading) {
    return <LoadingSpinner />;
  }

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
          />
          <Divider orientation="vertical" flexItem />
          {selectedChat == null ? (
            <NoChat />
          ) : (
            <ChatBox selectedChat={selectedChat} messages={messages} sendMessage={sendMessage} />
          )}
        </Stack>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
