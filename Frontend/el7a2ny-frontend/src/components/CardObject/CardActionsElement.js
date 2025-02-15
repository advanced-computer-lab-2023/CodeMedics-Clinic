import { Stack, CardActions, Button } from "@mui/material";

function CardActionsElement({ actions }) {
  const actionElements = actions.map((action) => {
    return (
      <CardActions sx={{pl: 4, pb: 2}}>
        <Button color="primary" variant="contained" size="small" onClick={action.onClick}>
            {action.name}
        </Button>
      </CardActions>
    );
  });
  return (
    <Stack direction="row">
      {actionElements}
    </Stack>
  );
}

export default CardActionsElement;
