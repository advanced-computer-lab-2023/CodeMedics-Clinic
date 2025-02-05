import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import CalendarDaysIcon from '@heroicons/react/24/solid/CalendarDaysIcon';
import ClipboardDocumentListIcon from '@heroicons/react/24/solid/ClipboardDocumentListIcon';
import ChatBubbleLeftRightIcon from '@heroicons/react/24/solid/ChatBubbleLeftRightIcon';
import MessageChatSquareIcon from '../../../icons/untitled-ui/duocolor/message-chat-square';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import CreditCard01Icon from '../../../icons/untitled-ui/duocolor/credit-card-01';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeSmileIcon from '../../../icons/untitled-ui/duocolor/home-smile';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const items = [
  {
    title: 'Doctors',
    path: '/patient/doctors',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Family Members',
    path: '/patient/family-members',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Appointments',
    path: '/patient/appointments',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Health Packages',
    path: '/patient/packages',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCard01Icon />
      </SvgIcon>
    )
  },
  {
    title: 'Prescriptions',
    path: '/patient/prescriptions',
    icon: (
      <SvgIcon fontSize="small">
        <AssignmentIcon      />
      </SvgIcon>
    )
  },
  {
    title: 'Medical History',
    path: '/patient/medical-history',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon      />
      </SvgIcon>
    )
  },
  {
    title: 'Chat',
    path: '/patient/chat',
    icon: (
      <SvgIcon fontSize="small">
        <MessageChatSquareIcon   />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/patient/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/patient/settings',
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon  />
      </SvgIcon>
    )
  },
];
