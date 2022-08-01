import PropTypes from "prop-types";
import {IconButton, ListItem, ListItemText, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import Iconify from "../Iconify";
import {ICON} from "../../utils/const";


const ElementItem = ({item}) => <ListItem
	dense
	divider
	secondaryAction={<IconButton><Iconify icon={ICON.add}/></IconButton>}
>
	<ListItemText primary={item.name}/>
</ListItem>

ElementItem.propTypes = {
	item: PropTypes.object
}


export default function ElementList({items}) {
	return <Autocomplete
		multiple
		id="tags-standard"
		options={items}
		getOptionLabel={(option) => option.name}
		defaultValue={items[0]}
		onChange={console.log}
		renderInput={(params) => (
			<TextField
				{...params}
				label="Atomes"
				placeholder="Selectionner un atome..."
			/>
		)}
	/>
}

ElementList.propTypes = {
	items: PropTypes.array
};