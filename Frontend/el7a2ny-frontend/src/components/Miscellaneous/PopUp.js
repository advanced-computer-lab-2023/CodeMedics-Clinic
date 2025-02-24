import {
  TableHead,
  Table,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TableBody,
} from "@mui/material";

function PopUp({
  title,
  viewing,
  setViewing,
  tableCells,
  actionName,
  setPopUpDisplay,
  children,
  actions,
}) {
  const tableCellsElements = tableCells
    ? tableCells.map((cell) => <TableCell>{cell}</TableCell>)
    : null;

  return (
    <Dialog
      open={viewing}
      onClose={() => {
        setViewing(false);
        if (setPopUpDisplay) {
          setPopUpDisplay(false);
        }
      }}
      sx={{ minWidth: 200 }}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Table>
          {tableCellsElements ? (
            <TableHead>
              <TableRow>{tableCellsElements}</TableRow>
            </TableHead>
          ) : null}
          <TableBody>{children}</TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        {actions ? (
          actions
        ) : (
          <Button
            onClick={() => {
              setViewing(false);
              if (setPopUpDisplay) {
                setPopUpDisplay(false);
              }
            }}
          >
            {actionName}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default PopUp;
