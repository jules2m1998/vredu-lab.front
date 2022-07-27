import {
	Button, Card, CardActions, CardContent,
	Container, Grid, Link,
	Stack,
	Typography,
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import {RequestContext} from "../http/RequestProvider";
import Loader from "../components/Loaders/Loader";
import TextureScreen from "../components/3d/TextureScreen";
import {ICON} from "../utils/const";
import {connectedUser} from "../store/user";
import ConfirmAlert from "../components/ConfirmAlert";
import useDelete from "../hooks/useDelete";
import NoContent from "../components/NoContent";
import {getDecantObject} from "../utils/object";

const TitleStyle = styled(Link)({
	overflow: 'hidden',
	WebkitLineClamp: 2,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	textTransform: "uppercase"
});

const Item = ({item, onReload}) => {
	const user = useSelector(connectedUser)
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const deleteMethod = useDelete()
	
	const handleDelete = useCallback(async () => {
		setLoading(true)
		await deleteMethod(`Texture/${item.id}`, "Suppression effectuee !")
		await onReload()
		setLoading(false)
		setOpen(false)
	}, [deleteMethod, item.id, onReload]);
	
	return <>
		<Grid item xs={12} sm={6} md={3}>
			<Card>
				<TextureScreen liquid={item.textureType === 0} texture={getDecantObject(item, item.parent)}/>
				<CardContent>
					<Stack flex direction="row" justifyContent="space-between">
						<TitleStyle
							to={(user.id === item?.user?.id || user.isAdmin) ? `/dashboard/textures/form/${item.id}`: null}
							color="inherit"
							variant="subtitle2"
							underline="hover"
							component={(user.id === item?.user?.id || user.isAdmin) ? RouterLink : 'div'}
						>
							{item.name}
						</TitleStyle>
					</Stack>
				</CardContent>
				<CardActions sx={{justifyContent: "end"}}>
					{
						(user.id === item?.user?.id || user.isAdmin) &&
						<Button onClick={() => setOpen(true)} color="error" size="small" startIcon={<Iconify icon={ICON.delete}/>}>
							Supprimer
						</Button>
					}
					
					<Button size="small" component={RouterLink} to={`/dashboard/textures/form/${item.id}?fork=true`} startIcon={<Iconify icon={ICON.update}/>}>
						Nouvelle version
					</Button>
				</CardActions>
			</Card>
		</Grid>
		<ConfirmAlert
			title={`Suppression de la texture l'equipement : ${item.name}`}
			description="Voulez-vous vraiment supprimer cet equipement ?"
			open={open}
			onClose={() => setOpen(false)}
			onSuccess={handleDelete}
			isLoading={loading}
		/>
	</>
}

Item.propTypes = {
	item: PropTypes.object,
	onReload: PropTypes.func,
}

const Line = ({item, onReload}) => {
	if (item?.items?.length === 0) return null
	return <>
		<Typography variant="h6" gutterBottom component="h1">
			{item.name}
		</Typography>
		<Grid container spacing={3}>
			{
				item?.items?.map((t, k) => <Item onReload={onReload} key={k} item={t}/>)
			}
		</Grid>
	</>
}
Line.propTypes = {
	item: PropTypes.object,
	onReload: PropTypes.func,
}

export default function Textures() {
	const [isloading, setloading] = useState(false);
	const [items, setItems] = useState([]);
	
	const separator = useMemo(() => items.reduce((acc, current) => {
		acc[current.textureType].items = [...acc[current.textureType].items, current]
		return acc
	}, [{items: [], name: "Liquide"}, {items: [], name: "Solide"}]), [items]);
	
	const request = useContext(RequestContext)
	
	const loadData = useCallback(async () => {
		setloading(true)
		const data = await request.fetch("/Texture");
		setItems(data)
		setloading(false)
	}, [request])
	
	useEffect(() => {
		loadData()
	}, [loadData])
	
	if (isloading) return <Loader text="Chargement des textures"/>
	
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
			{!!items.length && <Stack spacing={2}>
				{
					separator?.map((item, k) => <Line onReload={loadData} key={k} item={item}/>)
				}
			</Stack>}
			{
				!items.length &&
				<NoContent title="Aucune texture touvee !" description="Creez en une en grace au boutton ajouter ci-dessus !"/>
			}
		</Container>
	</Page>
}