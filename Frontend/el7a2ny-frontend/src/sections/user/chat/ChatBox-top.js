import {
  Stack,
  Typography,
  Avatar,
  SvgIcon,
  IconButton,
  Tooltip,
} from "@mui/material";
import CameraIcon from "@heroicons/react/24/solid/CameraIcon";
import { useRouter } from "next/navigation";

export const ChatBoxTop = (props) => {
  const router = useRouter();
  const { selectedChat, isPharmacy } = props;
  const name = isPharmacy
    ? "Code Medics Pharmacy"
    : `${selectedChat.doctor.firstName} ${selectedChat.doctor.lastName}`;

  const src = isPharmacy
    ? `/assets/Pharmacy-Logo.png`
    : selectedChat.doctor.picture == null
    ? `/assets/avatars/0.png`
    : selectedChat.doctor.picture;

  return (
    <Stack sx={{ m: 2 }} direction="row" justifyContent="space-between">
      <Stack direction="row">
        <Avatar alt={name} src={src} />
        <Stack sx={{ ml: 2, mt: 0.5 }}>
          <Typography variant="body1">{name}</Typography>
          {!isPharmacy && (
            <Typography variant="caption" color="textSecondary">
              {selectedChat.doctor.speciality}
            </Typography>
          )}
        </Stack>
      </Stack>
      {!isPharmacy && (
        <Tooltip title="Video Call">
          <IconButton
            onClick={() => {
              router.push(`/patient/videoCall?username=${selectedChat.doctor.username}`);
            }}
          >
            <SvgIcon color="action" fontSize="small">
              <CameraIcon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
