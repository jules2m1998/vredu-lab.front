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
	TableHead, TableBody
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import MyTabs from "../components/GenericArrays";
import {RequestContext} from "../http/RequestProvider";
import {UserMoreMenu} from "../sections/@dashboard/user";
import {toServerPath} from "../utils/string";

const Img = styled("img")(() => ({
	maxWidth: 30,
	maxHeight: 30
}))

const Row = ({item, isItemSelected, onSelected, isSetLoading, selected, onListSelected }) => {
	const [open, setOpen] = useState(false);
	const {name, data, id} = useMemo(() => item, [item])
	const handleSelectedItem = useCallback((e) => onSelected(e), [onSelected])
	const ids = useMemo(() => item.data.map(i => i.id), [item])
	const handleSelected = useCallback((e) => {
		onListSelected(e, ids)
	}, [ids, onListSelected])
	const isOneSelected = useMemo(() => ids.some(i => selected.includes(i)), [ids, selected])
	const isAllSelected = useMemo(() => ids.every(i => selected.includes(i)), [ids, selected])
	return <>
		<TableRow
			hover
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
				<UserMoreMenu
					id={id}
					isActivated={false}
					toggleState={() => {
					}}/>
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
								</TableRow>
							</TableHead>
							<TableBody>
								{
									data.map(({name, user: {userName}, image, id}, k) => {
										const isSubItemSelected = selected.indexOf(id) !== -1;
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
	</>
}

Row.propTypes = {
	item: PropTypes.object,
	isItemSelected: PropTypes.bool,
	isSetLoading: PropTypes.bool,
	onSelected: PropTypes.func,
	onListSelected: PropTypes.func,
	selected: PropTypes.array,
}

export default function Textures() {
	const [isloading, setloading] = useState(false);
	const [isSetLoading] = useState(false);
	const [items, setItems] = useState([])
	
	const request = useContext(RequestContext)
	
	useEffect(() => {
		setloading(true)
		request.fetch("/Texture/user").then(data => {
			setItems(data)
			setloading(false)
		})
	}, [request])
	
	const head = useMemo(() => [
		{id: 'name', label: 'Types de texture', alignRight: false},
		{id: ''},
	], [])
	
	const treeTexture = useMemo(() => Object.entries(items.reduce((acc, value) => {
		const {group} = value
		acc[group.name] = acc[group.name] ? [...acc[group.name], value] : [value]
		return {...acc}
	}, [])).map((item, k) => ({name: item[0], data: item[1], id: k})), [items])
	
	return <Page>
		<Container>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					Liste des textures
				</Typography>
				<Button disabled={isloading} variant="contained" component={RouterLink} to="/dashboard/user/form"
				        startIcon={<Iconify icon="eva:plus-fill"/>}>
					Nouvelle texture
				</Button>
			</Stack>
			<Card>
				<MyTabs head={head} items={treeTexture} isSetLoading={isSetLoading} isLoading={isloading} row={<Row/>}/>
			</Card>
		</Container>
	</Page>
}