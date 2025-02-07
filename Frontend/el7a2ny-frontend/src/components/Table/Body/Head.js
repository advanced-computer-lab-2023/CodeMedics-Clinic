import { TableCell, TableHead, TableRow } from "@mui/material"

function Head({columns}){
    if(!columns)
        return null
    const items = columns.map(column => <TableCell> {column} </TableCell>)
    return (
        <TableHead>
            <TableRow>
                {items} 
            </TableRow>
        </TableHead>
         )
}
export default Head