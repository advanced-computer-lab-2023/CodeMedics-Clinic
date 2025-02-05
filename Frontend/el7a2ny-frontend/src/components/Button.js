import { Button } from "@mui/material"
function Button({onClick, actionName}){
    return <Button onClick={onClick}>{actionName}</Button>
}

export default Button