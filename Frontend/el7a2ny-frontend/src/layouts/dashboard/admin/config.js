import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
export const items = [
  {
    title: "Admins",
    path: "/admin/admins",
    icon: (
      <SvgIcon fontSize="small">
        <SupervisorAccountIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Patients",
    path: "/admin/patients",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Doctors",
    path: "/admin/doctors",
    icon: (
      <SvgIcon fontSize="small">
        <MedicalServicesIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Requests",
    path: "/admin/requests",
    icon: (
      <SvgIcon fontSize="small">
        <ChecklistIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Packages",
    path: "/admin/packages",
    icon: (
      <SvgIcon fontSize="small">
        <AddShoppingCartIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Account",
    path: "/admin/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
