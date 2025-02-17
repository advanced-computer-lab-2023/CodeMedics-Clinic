import { Stack, CardActions, Button } from "@mui/material";

function CardActionsElement({ actions }) {
  const actionElements = actions.map((action, index) => (
    <CardActions key={index} sx={{ pl: 2, pb: 2 }}>
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
      justifyContent="center" // Center the buttons horizontally
      alignItems="center" // Center the buttons vertically
      spacing={2} // Add spacing between buttons
      sx={{ width: "100%" }} // Ensure the Stack takes full width
    >
      {actionElements}
    </Stack>
  );
}

export default CardActionsElement;