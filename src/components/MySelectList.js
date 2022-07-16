import {styled} from "@mui/material/styles";
import {Box, Button, IconButton, MenuItem, Stack, Typography} from "@mui/material";
import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import {DialogOneInput} from "./DialogOneInput";

const List = styled('div')(({theme}) => ({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	alignItems: "end",
	gap: 5,
	".Mui-selected": {
		background: theme.palette.primary.lighter
	}
}))

const Select = styled('div')(({theme,  error}) => ({
	display: "flex",
	border: `1px solid ${error ? theme.palette.error.light : "rgba(0,0,0,.15)"}`,
	width: "100%",
	padding: 8,
	flexWrap: "wrap",
	gap: 2
}))


const OneGroup = ({name, id, onEdit, onSelected, active, onResetError}) => {
	const [open, setOpen] = useState(false)
	
	const handleSubmit = useCallback(async (v) => {
		const isOk = await onEdit(id, v)
		if (isOk) setOpen(false)
	}, [id, onEdit])
	
	const handleOpenDialog = useCallback((e) => {
		e.stopPropagation()
		setOpen(true)
	}, [])
	
	const activate = useCallback(() => {
		onResetError()
		onSelected(id)
	}, [id, onResetError, onSelected])
	
	return <>
		<MenuItem
			onClick={activate}
			dense
			focusVisible
			divider sx={{border: "1px solid rgba(0,0,0,.13)"}}
			selected={active === id}
		>
			<Stack flex flexDirection="row" gap={2} alignItems="center" justifyContent="center">
				{name}
				<Stack flexDirection="row">
					<IconButton size="small">
						<Iconify icon={ICON.delete} sx={{color: "error.main"}}/>
					</IconButton>
					<IconButton size="small" onClick={handleOpenDialog}>
						<Iconify icon={ICON.update} sx={{color: "text.secondary"}}/>
					</IconButton>
				</Stack>
			</Stack>
		</MenuItem>
		{open && <DialogOneInput
			open={open}
			apiName="name"
			title="Modification d'un type de texture"
			description="Changer la valeur ci-dessous pour modifier ce type"
			onClose={() => setOpen(false)}
			label="Nom du groupe"
			value={name}
			onSubmit={handleSubmit}
		/>}
	</>
}

OneGroup.propTypes = {
	name: PropTypes.string,
	onEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	id: PropTypes.number,
	active: PropTypes.number,
}


MySelectList.propTypes = {
	items: PropTypes.array,
	onOneEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	active: PropTypes.number,
	errorMsg: PropTypes.string,
	onOpenAdd: PropTypes.func
}

export default function MySelectList({items, onOneEdit, onOpenAdd, onSelected, active, errorMsg, onResetError }) {
	return <List>
		<Box>
			<Select error={errorMsg ? 1 : 0}>
			{
				items.map(({id, name}, k) => <OneGroup id={id} name={name} key={k} onEdit={onOneEdit} onSelected={onSelected} active={active} onResetError={onResetError}/>)
			}
		</Select>
		<Typography variant="caption" align="center" sx={{color: "error.main", marginLeft: "14px"}}>{errorMsg}</Typography>
		</Box>
		<Box>
			<Button sx={{mb: 2}} onClick={onOpenAdd}>Ajouter un element</Button>
		</Box>
	</List>
}