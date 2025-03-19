import { Stack, Typography, Avatar, SvgIcon, IconButton, Tooltip } from "@mui/material";
import CameraIcon from "@heroicons/react/24/solid/CameraIcon";
import { useRouter } from "next/navigation";

export const ChatBoxTop = (props) => {
  const router = useRouter();
  const { selectedChat, isPharmacy, user } = props;
  const name = isPharmacy
    ? "Code Medics Pharmacy"
    : `${selectedChat[user].firstName} ${selectedChat[user].lastName}`;

  const src = isPharmacy
    ? `/assets/Pharmacy-Logo.png`
    : selectedChat[user].picture == null
    ? `/assets/avatars/0.png`
    : selectedChat[user].picture;

  return (
    <Stack sx={{ m: 2 }} direction="row" justifyContent="space-between">
      <Stack direction="row">
        <Avatar alt={name} src={src} />
        <Stack sx={{ ml: 2, mt: 0.5 }}>
          <Typography variant="body1">{name}</Typography>
          {!isPharmacy && user == "doctor" && (
            <Typography variant="caption" color="textSecondary">
              {selectedChat[user].speciality}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
