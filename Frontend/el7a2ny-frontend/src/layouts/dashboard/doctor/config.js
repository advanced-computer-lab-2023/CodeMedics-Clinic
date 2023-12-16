import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import CalendarDaysIcon from '@heroicons/react/24/solid/CalendarDaysIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import ChatBubbleLeftRightIcon from '@heroicons/react/24/solid/ChatBubbleLeftRightIcon';
import MessageChatSquareIcon from '../../../icons/untitled-ui/duocolor/message-chat-square';
import CreditCard01Icon from '../../../icons/untitled-ui/duocolor/credit-card-01';
import HomeSmileIcon from '../../../icons/untitled-ui/duocolor/home-smile';

export const items = [
  {
    title: 'Patients',
    path: '/doctor/patients',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Appointments',
    path: '/doctor/appointments',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Prescriptions',
    path: '/doctor/AllPrescriptions',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCard01Icon />
      </SvgIcon>
    )
  },
  {
    title: 'Chat',
    path: '/doctor/chat',
    icon: (
      <SvgIcon fontSize="small">
        <MessageChatSquareIcon   />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/doctor/account',
    icon: (
      <SvgIcon fontSize="small">
        <HomeSmileIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/doctor/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon  />
      </SvgIcon>
    )
  }
];
