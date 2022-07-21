import {
	Button,
	Card,
	Checkbox,
	TableRow,
	Container,
	Stack,
	TableCell,
	Typography,
	IconButton,
	Collapse,
	Box,
	Table,
	TableHead,
	TableBody,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions
} from "@mui/material";
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {Link as RouterLink} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {useSnackbar} from "notistack";
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import MyTabs, {MoreAction} from "../components/GenericArrays";
import {RequestContext} from "../http/RequestProvider";
import {toServerPath} from "../utils/string";
import {removeArrayWithId} from "../utils/array";
import {ICON} from "../utils/const";
import {FormProvider, RHFTextField} from "../components/hook-form";

const Img = styled("img")(() => ({
	maxWidth: 30,
	maxHeight: 30
}))

const Row = (
	{
		item,
		isItemSelected,
		onSelected,
		isSetLoading,
		selected,
		onListSelected,
		onReloadData,
		onDeleteItems
	}) => {
	const [open, setOpen] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const {name, data, id} = useMemo(() => item, [item])
	const handleSelectedItem = useCallback((e) => {
		if (!isSetLoading) onSelected(e)
	}, [isSetLoading, onSelected])
	const ids = useMemo(() => item.data.map(i => i.id), [item])
	
	const request = useContext(RequestContext);
	const {enqueueSnackbar} = useSnackbar()
	
	const handleSelected = useCallback((e) => {
		onListSelected(e, ids)
	}, [ids, onListSelected])
	
	const handleDeleteMany = useCallback(() => {
		const event = {target: {checked: true}}
		onListSelected(event, ids)
		onDeleteItems()
	}, [ids, onDeleteItems, onListSelected]);
	
	const handleClose = useCallback(() => {
		setOpenDialog(false)
	}, [])
	const handleOpen = useCallback(() => {
		setOpenDialog(true)
	}, [])
	const onSubmitEdit = useCallback(async (e) => {
		if (e.data.trim() !== name) {
			const data = await request.fetch(`TextureGroup/${id}?name=${e.data.trim()}`, {
				method: "put",
				successMsg: "Type de texture modifiee !"
			})
			if (data) {
				onReloadData()
				setOpenDialog(false)
			}
		} else {
			enqueueSnackbar("Vous n'avez pas mofifiez le nom du type", {variant: "warning"})
		}
	}, [enqueueSnackbar, id, name, onReloadData, request])
	
	const isOneSelected = useMemo(() => ids.some(i => selected.includes(i)), [ids, selected])
	const isAllSelected = useMemo(() => ids.every(i => selected.includes(i)), [ids, selected])
	const menus = useMemo(() => [
		{
			title: "Modifier",
			icon: ICON.update,
			onClick: () => handleOpen()
		},
		{
			title: "Supprimer",
			icon: ICON.delete,
			color: "text.accent",
			onClick: handleDeleteMany
		}
	], [handleDeleteMany, handleOpen])
	
	const updateType = useMemo(() => Yup.object().shape({
		data: Yup.string().required("Le nom du type de texture est obligatoire !")
	}), [])
	
	const defaultValues = useMemo(() => ({
		data: name
	}), [name])
	
	const methods = useForm({
		resolver: yupResolver(updateType),
		defaultValues
	})
	
	const {
		handleSubmit,
		formState: {isSubmitting},
	} = methods;
	
	return <>
		<TableRow
			key={id}
			tabIndex={-1}
			role="checkbox"
			aria-checked={isItemSelected}
		>
			<TableCell padding="checkbox">
				<Checkbox
					indeterminate={isOneSelected && !isAllSelected}
					checked={isAllSelected}
					onChange={handleSelected}
					disabled={isSetLoading}
				/>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle2" noWrap>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(o => !o)}
					>
						{open ? <Iconify sx={{width: 10, height: 20}} icon="ant-design:up-outlined"/> :
							<Iconify sx={{width: 10, height: 20}} icon="ant-design:down-outlined"/>}
					</IconButton>
					{name}
				</Typography>
			</TableCell>
			<TableCell align="right">
				<MoreAction menus={menus}/>
			</TableCell>
		</TableRow>
		<TableRow
			hover
			key={`${id}s`}
			tabIndex={-1}
			role="checkbox"
		>
			<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box sx={{margin: 1}}>
						<Table size="small" aria-label="purchases">
							<TableHead>
								<TableRow>
									<TableCell>Nom</TableCell>
									<TableCell>Image</TableCell>
									<TableCell>Cree par</TableCell>
									<TableCell/>
									<TableCell/>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									data.map(({name, user: {userName}, image, id}, k) => {
											const isSubItemSelected = selected.indexOf(id) !== -1;
											const handleDeleteOne = () => {
												handleSelectedItem(id)
												onDeleteItems()
											}
											
											const menu = [
												{
													title: "Modifier",
													icon: ICON.update,
													link: `/dashboard/textures/form/${id}`
												},
												{
													title: "Supprimer",
													icon: ICON.delete,
													color: "text.accent",
													onClick: handleDeleteOne
												}
											]
											return (
												<TableRow hover selected={isSubItemSelected} onClick={() => handleSelectedItem(id)} key={k}>
													<TableCell>
														{name}
													</TableCell>
													<TableCell>
														<Img src={toServerPath(image)} alt={`Texture ${name}`}/>
													</TableCell>
													<TableCell>
														{userName}
													</TableCell>
													<TableCell align={"right"}>
														<MoreAction menus={menu}/>
													</TableCell>
												</TableRow>
											)
										}
									)
								}
							</TableBody>
						</Table>
					</Box>
				</Collapse>
			</TableCell>
		</TableRow>
		<Dialog open={openDialog}>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmitEdit)}>
				<DialogTitle>
					Modifier un type de texture
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Veillez entrer le nouveau nom de type de texture
					</DialogContentText>
					<RHFTextField sx={{mt: 3}} name="data" label="Nom du type de texture !"/>
				</DialogContent>
				<DialogActions>
					<LoadingButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
						Enregistrer
					</LoadingButton>
					<Button disabled={isSubmitting} onClick={handleClose} sx={{color: 'text.accent'}}>
						Annuler
					</Button>
				</DialogActions>
			</FormProvider>
		</Dialog>
	</>
}
Row.propTypes = {
	item: PropTypes.object,
	isItemSelected: PropTypes.bool,
	isSetLoading: PropTypes.bool,
	onSelected: PropTypes.func,
	onListSelected: PropTypes.func,
	onReloadData: PropTypes.func,
	onDeleteItems: PropTypes.func,
	selected: PropTypes.array,
}

const ActionButton = ({selected, onDeleteItems}) => {
	const handleDeleteList = useCallback(async () => {
		onDeleteItems()(selected)
	}, [onDeleteItems, selected])
	
	return <>
		<IconButton disabled={selected.length !== 1} component={RouterLink} to={`/dashboard/textures/form/${selected[0]}`}>
			<Iconify
				icon="ant-design:edit-outlined"
				sx={selected.length === 1 ? {color: "text.primary"} : {}}
			/>
		</IconButton>
		<IconButton onClick={handleDeleteList}>
			<Iconify
				icon="ep:delete"
				sx={{color: "text.accent"}}
			/>
		</IconButton>
	</>
}

ActionButton.propTypes = {
	selected: PropTypes.array,
	onDeleteItems: PropTypes.func,
}

export default function Textures() {
	const [isloading, setloading] = useState(false);
	const [isSetLoading, setSetLoading] = useState(false);
	const [items, setItems] = useState([])
	
	const request = useContext(RequestContext)
	
	const loadData = useCallback(() => {
		setloading(true)
		request.fetch("/Texture/user").then(data => {
			setItems(data)
			setloading(false)
		})
	}, [request])
	
	useEffect(loadData, [loadData])
	
	const head = useMemo(() => [
		{id: 'name', label: 'Types de texture', alignRight: false},
		{id: ''},
	], [])
	
	const treeTexture = useMemo(() => Object.entries(items.reduce((acc, value) => {
		const {group} = value
		acc[group.name] = acc[group.name] ? [...acc[group.name], value] : [value]
		return {...acc}
	}, [])).map((item) => ({name: item[0], data: item[1], id: item[1][0]?.group.id})), [items])
	const handleDeleteList = useCallback(async (e) => {
		setSetLoading(true)
		await Promise.all(e.map(i => request.fetch(`Texture/${i}`, {method: "delete"})))
		setItems((it) => removeArrayWithId(it, e))
		setSetLoading(false)
	}, [request])
	
	return <Page title="Textures">
		<Container>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					Liste des textures
				</Typography>
				<Button
					disabled={isloading}
					variant="contained"
					component={RouterLink}
					to="/dashboard/textures/form"
					startIcon={<Iconify icon="eva:plus-fill"/>}
				>
					Nouvelle texture
				</Button>
			</Stack>
			<Card>
				<MyTabs
					actionsButton={<ActionButton/>}
					head={head}
					items={treeTexture}
					isSetLoading={isSetLoading}
					isLoading={isloading}
					row={<Row/>}
					onDeleteItems={handleDeleteList}
					onReloadData={loadData}
					deleteMessage="Vous voulez vraiment supprimer ces textures ?"
					deleteDescription="La suppression de cette texture de tous ce qui les composes !"
					searchPlaceholder="Rechercher un type de texture..."
				/>
			</Card>
		</Container>
	</Page>
}