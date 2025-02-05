import { Card, Table, TableBody } from "@mui/material";
import Head from "./Head";
import { useContext } from "react";
import { TableContext } from "../Table";
import { Box } from "@mui/system";

function Content() {
  const {columns, tableRows} = useContext(TableContext);
  return (
    <Card>
      <Box>
        <Table>
          <Head columns={columns} />
          <TableBody>{tableRows}</TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default Content;
