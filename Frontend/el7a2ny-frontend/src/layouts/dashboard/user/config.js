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

import HomeSmileIcon from '../../../icons/untitled-ui/duocolor/home-smile';

export const items = [
  {
    title: 'Doctors',
    path: '/user/doctors',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Family Members',
    path: '/user/family-members',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Appointments',
    path: '/user/my-appointments',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Health Packages',
    path: '/user/packages',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCard01Icon />
      </SvgIcon>
    )
  },
  {
    title: 'Prescriptions',
    path: '/user/prescriptions',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon      />
      </SvgIcon>
    )
  },
  {
    title: 'Medical History',
    path: '/user/medical-history',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon      />
      </SvgIcon>
    )
  },
  {
    title: 'Chat',
    path: '/user/chat',
    icon: (
      <SvgIcon fontSize="small">
        <MessageChatSquareIcon   />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/user/account',
    icon: (
      <SvgIcon fontSize="small">
        <HomeSmileIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/user/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon  />
      </SvgIcon>
    )
  },
];
