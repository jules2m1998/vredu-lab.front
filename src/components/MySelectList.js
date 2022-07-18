import {styled} from "@mui/material/styles";
import {Box, Button, IconButton, MenuItem, Stack, Typography} from "@mui/material";
import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import {DialogOneInput} from "./DialogOneInput";
import ConfirmAlert from "./ConfirmAlert";

const List = styled('div')(({theme}) => ({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	alignItems: "end",
	gap: 5,
	".Mui-selected": {
		background: theme.palette.primary.lighter,
		border: `1px solid ${theme.palette.primary.dark}`
	}
}))

const Select = styled('div')(({theme, error}) => ({
	display: "flex",
	border: `1px solid ${error ? theme.palette.error.light : "rgba(0,0,0,.15)"}`,
	width: "100%",
	padding: 8,
	flexWrap: "wrap",
	gap: 2
}))


const OneGroup = ({name, id, onEdit, onSelected, active, onResetError, loading, onDelete}) => {
	const [open, setOpen] = useState(false)
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	
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
	
	const handleDelete = useCallback(async () => {
		setLoadingDelete(true)
		await onDelete(id)
		setLoadingDelete(false)
		setOpenDelete(false)
	}, [id, onDelete]);
	
	const handleClickOpenDeleteDialog = useCallback((e) => {
		e.stopPropagation()
		setOpenDelete(true)
	}, [])
	
	return <>
		<MenuItem
			onClick={activate}
			dense
			focusVisible
			divider
			sx={{border: "1px solid rgba(0,0,0,.13)"}}
			selected={active === id}
			disabled={loading}
		>
			<Stack flex flexDirection="row" gap={2} alignItems="center" justifyContent="center">
				{name}
				<Stack flexDirection="row">
					<IconButton size="small" onClick={handleClickOpenDeleteDialog}>
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
		{openDelete && <ConfirmAlert
			open={openDelete}
			onClose={() => setOpenDelete(false)}
			title={`Voulez vous vraiment supprimer le groupe de texture ${name} ?`}
			description="Sa suppression entraiinera aussi celle des texture de ce group !"
			onSuccess={handleDelete}
			isLoading={loadingDelete}
		/>}
	</>
}

OneGroup.propTypes = {
	name: PropTypes.string,
	onEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	onDelete: PropTypes.func,
	id: PropTypes.number,
	loading: PropTypes.bool,
	active: PropTypes.number,
}


MySelectList.propTypes = {
	items: PropTypes.array,
	onOneEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	onDeleteOne: PropTypes.func,
	active: PropTypes.number,
	loading: PropTypes.bool,
	errorMsg: PropTypes.string,
	onOpenAdd: PropTypes.func
}

export default function MySelectList(
	{
		items,
		onOneEdit,
		onOpenAdd,
		onSelected,
		active,
		errorMsg,
		onResetError,
		loading,
		onDeleteOne
	}) {
	return <List>
		<Box>
			<Select error={errorMsg ? 1 : 0}>
				{
					items.map(({id, name}, k) => (
						<OneGroup
							disabled={loading}
							id={id}
							name={name}
							key={k}
							onEdit={onOneEdit}
							onSelected={onSelected}
							active={active}
							onResetError={onResetError}
							onDelete={onDeleteOne}
						/>
					))
				}
			</Select>
			<Typography variant="caption" align="center"
			            sx={{color: "error.main", marginLeft: "14px"}}>{errorMsg}</Typography>
		</Box>
		<Box>
			<Button sx={{mb: 2}} onClick={onOpenAdd} disabled={loading}>Ajouter un element</Button>
		</Box>
	</List>
}