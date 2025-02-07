import {
  Card,
  ListItem,
  ListItemText,
} from "@mui/material";
import CardAvatar from "./CardAvatar";

function CardObject({ item, index, texts, cardActionsElement }) {
  const textsElement = texts.map((text, idx) => {
    return (
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: idx == 0 ? "h6" : idx == 1 ? "subtitle1" : "subtitle2",
        }}
      />
    );
  });
  console.log("picture", item.Picture, index);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <ListItem
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          textAlign: "center",
        }}
      >
        <CardAvatar src={!item.Picture ? `/assets/avatars/${index}.png` : item.Picture} />
        {textsElement}
      </ListItem>

      {cardActionsElement}
    </Card>
  );
}
export default CardObject;
