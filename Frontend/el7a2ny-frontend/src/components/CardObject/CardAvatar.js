import { Box, ListItemAvatar } from "@mui/material";
function CardAvatar({ src }) {
  return (
      <Box
        component="img"
        src={src}
        sx={{
          borderRadius: "50%",
          height: 120,
          width: 120,
          objectFit: "cover",
          margin: "0 auto",
          backgroundColor: "neutral.200",
        }}
      />
  );
}

export default CardAvatar;
