import { IconButton, SvgIcon } from "@mui/material";

function Icon({disabled, title, onClick, children}){
    return (
        <IconButton disabled={disabled} title={title} onClick={onClick}>
          <SvgIcon fontSize="small">
            {children}
          </SvgIcon>
        </IconButton>
    )
}

export default Icon