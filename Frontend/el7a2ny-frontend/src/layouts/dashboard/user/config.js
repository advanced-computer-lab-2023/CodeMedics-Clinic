import UserIcon from "@heroicons/react/24/solid/UserIcon";
import CalendarDaysIcon from "@heroicons/react/24/solid/CalendarDaysIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon";
import MessageChatSquareIcon from "../../../icons/untitled-ui/duocolor/message-chat-square";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { SvgIcon } from "@mui/material";
import CreditCard01Icon from "../../../icons/untitled-ui/duocolor/credit-card-01";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VideoCameraIcon from "@heroicons/react/24/solid/VideoCameraIcon";

export const items = [
  {
    title: "Account",
    path: "/patient/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Doctors",
    path: "/patient/doctors",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Appointments",
    path: "/patient/appointments",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Prescriptions",
    path: "/patient/prescriptions",
    icon: (
      <SvgIcon fontSize="small">
        <AssignmentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Family Members",
    path: "/patient/family-members",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Health Packages",
    path: "/patient/packages",
    icon: (
      <SvgIcon fontSize="small">
        <CreditCard01Icon />
      </SvgIcon>
    ),
  },
  {
    title: "Medical History",
    path: "/patient/medical-history",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Chat",
    path: "/patient/chat",
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
    path: "/patient/settings",
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon />
      </SvgIcon>
    ),
  },
];
