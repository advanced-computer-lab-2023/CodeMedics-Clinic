import { TableRow } from "@mui/material"

function Row({hover, children}){
    return <TableRow hover={hover}>{children}</TableRow>
}

export default Row