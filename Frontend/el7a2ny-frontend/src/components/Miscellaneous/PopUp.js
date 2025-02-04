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

function PopUp({ title, viewing, setViewing, tableCells, actionName, setPopUpDisplay, children }) {
  const tableCellsElements = tableCells
    ? tableCells.map((cell) => <TableCell>{cell}</TableCell>)
    : null;

  return (
    <Dialog
      open={viewing}
      onClose={() => {
        setViewing(false);
        if(setPopUpDisplay){
          setPopUpDisplay(false)
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
        <Button
          onClick={() => {
            setViewing(false);
            if(setPopUpDisplay){
              setPopUpDisplay(false)
            }
            console.log("Closing")
            console.log(setPopUpDisplay)
          }}
        >
          {actionName}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopUp;
