import CalendarDaysIcon from "@heroicons/react/24/solid/CalendarDaysIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import VideoCameraIcon from "@heroicons/react/24/solid/VideoCameraIcon";
import { SvgIcon } from "@mui/material";
import MessageChatSquareIcon from "../../../icons/untitled-ui/duocolor/message-chat-square";
import HomeSmileIcon from "../../../icons/untitled-ui/duocolor/home-smile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";

export const items = [
  {
    title: "Account",
    path: "/doctor/account",
    icon: (
      <SvgIcon fontSize="small">
        <HomeSmileIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Patients",
    path: "/doctor/patients",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Appointments",
    path: "/doctor/appointments",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Prescriptions",
    path: "/doctor/AllPrescriptions",
    icon: (
      <SvgIcon fontSize="small">
        <AssignmentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Follow-Up Requests",
    path: "/doctor/follow-up-requests",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Chat",
    path: "/doctor/chat",
    icon: (
      <SvgIcon fontSize="small">
        <MessageChatSquareIcon />
      </SvgIcon>
    ),
  },
  {
    title: "CodeMedics Meet",
    path: "/rooms/video-chat",
    icon: (
      <SvgIcon fontSize="small">
        <VideoCameraIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/doctor/settings",
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon />
      </SvgIcon>
    ),
  },
];
