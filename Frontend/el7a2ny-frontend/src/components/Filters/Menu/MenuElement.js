import {MenuItem} from "@mui/material"

function MenuElement({option}){
    return (
        <MenuItem value={option.value}>
            {option.label}
        </MenuItem>
    )
}

export default MenuElement