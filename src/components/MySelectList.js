import {styled} from "@mui/material/styles";
import {Box, Button, IconButton, MenuItem, Stack, Typography} from "@mui/material";
import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import {DialogOneInput} from "./dialog/DialogOneInput";
import ConfirmAlert from "./ConfirmAlert";
import {Select} from "../style";

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


const OneGroup = (
	{
		item,
		onEdit,
		onSelected,
		active,
		onResetError,
		loading,
		onDelete,
		content = null,
		onOpenDialog = null,
		deleteAlertTitle = `Voulez vous vraiment supprimer le groupe de texture ${item.name} ?`,
		deleteAlertContent = "Sa suppression entrainera aussi celle des texture de ce group !",
	}) => {
	const [open, setOpen] = useState(false)
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	
	const handleSubmit = useCallback(async (v) => {
		const isOk = await onEdit(item.id, v)
		if (isOk) setOpen(false)
	}, [item, onEdit])
	
	const handleOpenDialog = useCallback((e) => {
		e.stopPropagation()
		if (!onOpenDialog) {
			setOpen(true)
		} else {
			onOpenDialog(item.id)
		}
	}, [item, onOpenDialog])
	
	const activate = useCallback(() => {
		onResetError()
		onSelected(item.id)
	}, [item, onResetError, onSelected])
	
	const handleDelete = useCallback(async () => {
		setLoadingDelete(true)
		await onDelete(item.id)
		setLoadingDelete(false)
		setOpenDelete(false)
	}, [item, onDelete]);
	
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
			selected={active === item.id}
			disabled={loading}
		>
			<Stack flex flexDirection="row" gap={2} alignItems="center" justifyContent="center">
				{content || item.name}
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
			value={item.name}
			onSubmit={handleSubmit}
		/>}
		{openDelete && <ConfirmAlert
			open={openDelete}
			onClose={() => setOpenDelete(false)}
			title={deleteAlertTitle}
			description={deleteAlertContent}
			onSuccess={handleDelete}
			isLoading={loadingDelete}
		/>}
	</>
}

OneGroup.propTypes = {
	item: PropTypes.object,
	onEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	onDelete: PropTypes.func,
	onOpenDialog: PropTypes.func,
	loading: PropTypes.bool,
	content: PropTypes.node,
	active: PropTypes.number,
	deleteAlertTitle: PropTypes.string,
	deleteAlertContent: PropTypes.string,
}


MySelectList.propTypes = {
	items: PropTypes.array.isRequired,
	onOneEdit: PropTypes.func,
	onSelected: PropTypes.func,
	onResetError: PropTypes.func,
	onDeleteOne: PropTypes.func,
	active: PropTypes.number,
	loading: PropTypes.bool,
	errorMsg: PropTypes.string,
	onOpenAdd: PropTypes.func,
	onOpenDialog: PropTypes.func,
	deleteAlertTitle: PropTypes.string,
	deleteAlertContent: PropTypes.string,
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
		onDeleteOne,
		onOpenDialog = null,
		deleteAlertTitle = null,
		deleteAlertContent = null
	}) {
	return <List>
		{!!items.length && <Box>
			<Select error={errorMsg ? 1 : 0}>
				{
					items.map((i, k) => (<OneGroup
							disabled={loading}
							item={i}
							key={k}
							onEdit={onOneEdit}
							onSelected={onSelected}
							active={active}
							onResetError={onResetError}
							onDelete={onDeleteOne}
							loading={loading}
							content={i.content}
							onOpenDialog={onOpenDialog}
							deleteAlertTitle={deleteAlertTitle}
							deleteAlertContent={deleteAlertContent}
						/>
					))
				}
			</Select>
			<Typography variant="caption" align="center"
			            sx={{color: "error.main", marginLeft: "14px"}}>{errorMsg}</Typography>
		</Box>}
		{
			!items.length && <Typography sx={{color: 'text.secondary'}}>
				Aucun element trouve veillez en creer
			</Typography>
		}
		<Box>
			<Button sx={{mb: 2}} onClick={onOpenAdd} disabled={loading}>Ajouter un element</Button>
		</Box>
	</List>
}