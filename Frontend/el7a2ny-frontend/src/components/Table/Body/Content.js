import { Card, Table, TableBody, Box, CardContent } from "@mui/material";
import Head from "./Head";
import { useContext } from "react";
import { TableContext } from "../Table";

function Content() {
  const { columns, tableRows, displayGrid } = useContext(TableContext);
  return (
    <Card>
      <Box>
        <Table>
          <Head columns={columns} />
          <TableBody>
            {displayGrid ? (
              <CardContent>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                  gap={2}
                >
                  {tableRows}
                </Box>
              </CardContent>
            ) : (
               tableRows 
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default Content;
