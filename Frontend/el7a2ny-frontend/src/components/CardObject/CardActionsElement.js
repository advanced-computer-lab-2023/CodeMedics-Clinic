import { Stack, CardActions, Button } from "@mui/material";

function CardActionsElement({ actions }) {
  const actionElements = actions.map((action) => {
    return (
      <CardActions sx={{ pl: 2, pb: 2 }}>
        <Button
          color="primary"
          variant="contained"
          size="small"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-flex",
            alignItems: "center",
          }}
          onClick={action.onClick}
        >
          {action.name}
        </Button>
      </CardActions>
    );
  });
  return <Stack direction="row">{actionElements}</Stack>;
}

export default CardActionsElement;
