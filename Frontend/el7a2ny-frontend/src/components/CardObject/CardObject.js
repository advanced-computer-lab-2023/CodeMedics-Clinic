import { Card, ListItem, Box, CardContent, ListItemText } from "@mui/material";
import CardAvatar from "./CardAvatar";

function CardObject({ item, index, texts, variants, cardActionsElement }) {
  const textsElement = texts.map((text, idx) => {
    return (
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: variants
            ? variants[idx]
            : idx == 0
            ? "h6"
            : idx == 1
            ? "subtitle1"
            : "subtitle2",
        }}
      />
    );
  });

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <ListItem
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            <CardAvatar
              src={
                item.src ? item.src : !item.Picture ? `/assets/avatars/${index}.png` : item.Picture
              }
            />
            {textsElement}
          </ListItem>
        </Box>
      </CardContent>
      {cardActionsElement}
    </Card>
  );
}
export default CardObject;
