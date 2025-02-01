import {TextField} from "@mui/material"
import {MenuElement} from "./MenuElement"

function MenuFilter({options, menuName, defaultValue, setValue}){

    const menuElems = options.map(option => (
        <MenuElement key={option.value} option={option}/>
    ))

    return(
        <TextField select fullWidth label={menuName} defaultValue={defaultValue}
        onChange={(str) => setValue(str.target.value)} >
            {menuElems}
        </TextField>
    )
}

export default MenuFilter