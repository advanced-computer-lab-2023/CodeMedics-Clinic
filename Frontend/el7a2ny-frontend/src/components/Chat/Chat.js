import Head from "next/head";
import { Box, Divider } from "@mui/material";
import { ChatSidebar } from "./ChatSidebar";
import { ChatBox } from "./ChatBox";
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

const Chat = ({ isPatient }) => {
  const username = Cookies.get("username");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesCache, setMessagesCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchName, setSearchName] = useState("");

  const data = filterData();
  const route = isPatient ? "patients" : "doctors";
  console.log("filtering", searchName, chats, data);

  useGet({
    url: `${BACKEND_ROUTE}/${route}/${username}/chats`,
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

  function filterData() {
    console.log("search name", searchName);
    if (searchName == "") return chats;
    return chats.filter((item) => {
      if (item.pharmacy) {
        return "code medics pharmacy".includes(searchName.toLowerCase());
      }
      const obj = item.patient || item.doctor;
      console.log(
        "filtering name",
        `${obj.firstName} ${obj.lastName}`,
        searchName,
        `${obj.firstName} ${obj.lastName}`.toLowerCase().includes(searchName.toLowerCase())
      );
      return `${obj.firstName} ${obj.lastName}`.toLowerCase().includes(searchName.toLowerCase());
    });
  }

  const updateChats = (message) => {
    console.log("updating", message);
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
      .sort(
        (a, b) => new Date(b.latestMessage.createdAt) - new Date(a.chat.latestMessage.createdAt)
      );
    setChats(updatedChats);
    if (messagesCache[message.chat]) {
      setMessagesCache((prev) => ({
        ...prev,
        [message.chat]: [...(prev[message.chat] || []), message],
      }));
    } else {
      GET({
        url: `${BACKEND_ROUTE}/${route}/chats/${message.chat}/messages`,
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
        url: `${BACKEND_ROUTE}/${route}/chats/${chatId}/messages`,
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
      url: `${BACKEND_ROUTE}/${route}/chats/${selectedChat.chat._id}/messages`,
      body,
      setShowError,
      setError,
      updater: () => {
        const newMessage = {
          chat: selectedChat.chat._id,
          sender: body.sender,
          content: body.content,
          createdAt: new Date(),
        };
        updateChats(newMessage);
        const eventName = selectedChat.pharmacy ? "newMessagePharmacy" : "newMessage";
        const payload = selectedChat.pharmacy
          ? { message: newMessage, receiver: Cookies.get("username"), sendingToPharmacy: true }
          : {
              message: newMessage,
              receiver: isPatient ? selectedChat.doctor.username : selectedChat.patient.username,
            };

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
            chats={data}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            searchName={searchName}
            setSearchName={setSearchName}
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

export default Chat;
