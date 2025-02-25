import { Stack, CardActions, Button } from "@mui/material";

function CardActionsElement({ actions }) {
  const actionElements = actions.map((action) => (
    <CardActions
      sx={{
        pt: 1,
        pb: 2,
        px: 0,
        display: "flex",
        justifyContent: "center",
        gap: 0,
      }}
    >
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
        disabled={action.disabled}
        onClick={action.onClick}
      >
        {action.name}
      </Button>
    </CardActions>
  ));

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%" }}
    >
      {actionElements}
    </Stack>
  );
}

export default CardActionsElement;
