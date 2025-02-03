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
  TableBody
} from "@mui/material";

function PopUp({ title, viewing, setViewing, tableCells, actionName, children }) {
  const tableCellsElements = tableCells.map((cell) => <TableCell>{cell}</TableCell>);

  return (
    <Dialog
      open={viewing}
      onClose={() => {
        setViewing(false);
      }}
      sx={{ minWidth: 200 }}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>{tableCellsElements}</TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setViewing(false);
          }}
        >
          {actionName}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopUp;
