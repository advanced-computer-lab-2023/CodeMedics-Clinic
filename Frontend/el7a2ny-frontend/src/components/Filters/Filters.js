import { Card, Stack } from "@mui/material";
import DateFilter from "./DateFilter";
import TextFilter from "./TextFilter";
import MenuFilter from "./Menu/MenuFilter";

function Filters({filters}){
    console.log("all filters rendered")
    const allFilters = filters.map((filter) => {
        if(filter.type === "menu"){
            return <MenuFilter 
                options={filter.options}
                menuName={filter.name}
                setValue={filter.setState}
                />
        }
        else if(filter.type === "text"){
            return <TextFilter option={filter.name} setValue={filter.setState} />
        }
        else if(filter.type === "date"){
            return <DateFilter option={filter.name} setDate={filter.setState}/>
        }
        else{
            throw new Error('unhandled filter type');
        }
    })

    return (
        <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={3}>
                {allFilters}
            </Stack>
        </Card>
    )
}

export default Filters