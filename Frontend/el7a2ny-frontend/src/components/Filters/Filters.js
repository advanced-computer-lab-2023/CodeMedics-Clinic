import {useState} from "react"
import DateFilter from "./DateFilter";
import TextFilter from "./TextFilter";
import MenuFilter from "./Menu/MenuFilter";

function Filters({filters}){

    const filterStates = filters.map(filter => {
        const [state, setState] = useState(filter.defaultValue)
        return {state, setState}
    })

    const allFilters = filters.map((filter, index) => {
        if(filter.type === "menu"){
            return <MenuFilter 
                options={filter.options}
                menuName={filter.name}
                defaultValue={filter.defaultValue}
                setValue={filterStates[index].setState}
                />
        }
        else if(filter.type === "text"){
            return <TextFilter option={filter.name} setValue={filterStates[index].setState} />
        }
        else if(filter.type === "date"){
            return <DateFilter option={filter.name} setDate={filterStates[index].setState}/>
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