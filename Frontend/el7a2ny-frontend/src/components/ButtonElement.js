import { Button } from "@mui/material"
function ButtonElement({onClick, actionName}){
    return <Button onClick={onClick}>{actionName}</Button>
}

export default ButtonElement