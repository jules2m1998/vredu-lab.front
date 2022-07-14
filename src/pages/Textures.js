import {Button, Card, Checkbox, TableRow, Container, Stack, TableCell, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import MyTabs from "../components/GenericArrays";
import {RequestContext} from "../http/RequestProvider";
import {UserMoreMenu} from "../sections/@dashboard/user";

const Row = ({item, isItemSelected, onSelected, isSetLoading}) => {
	const {name, group, user: {userName}, image, id} = useMemo(() => item, [item])
	const handleSelected = useCallback(() => onSelected(id), [id, onSelected])
	return <TableRow
		hover
		key={id}
		tabIndex={-1}
		role="checkbox"
		aria-checked={isItemSelected}
		selected={isItemSelected}
	>
		<TableCell padding="checkbox">
			<Checkbox
				checked={isItemSelected}
				onChange={handleSelected}
				disabled={isSetLoading}
			/>
		</TableCell>
		<TableCell>
			<Typography variant="subtitle2" noWrap>
				{name}
			</Typography>
		</TableCell>
		<TableCell>
			<Typography variant="subtitle2" noWrap>
				{group?.name}
			</Typography>
		</TableCell>
		<TableCell>
			<Typography variant="subtitle2" noWrap>
				{userName}
			</Typography>
		</TableCell>
		<TableCell>
			<Typography variant="subtitle2" noWrap>
				{image}
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
}

Row.propTypes = {
	item: PropTypes.object,
	isItemSelected: PropTypes.bool,
	isSetLoading: PropTypes.bool,
	onSelected: PropTypes.func
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
		{id: 'name', label: 'Nom', alignRight: false},
		{id: 'group', label: 'Groupe', alignRight: false},
		{id: 'username', label: 'Enregistre par', alignRight: false},
		{id: 'image', label: 'Image', alignRight: false},
		{id: ''},
	], [])
	
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
				<MyTabs head={head} items={items} isSetLoading={isSetLoading} isLoading={isloading} row={<Row/>} />
			</Card>
		</Container>
	</Page>
}