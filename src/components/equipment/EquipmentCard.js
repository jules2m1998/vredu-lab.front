import PropTypes from "prop-types";
import {Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Link, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useCallback, useMemo, useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {MoreAction} from "../GenericArrays";
import {ICON} from "../../utils/const";
import Screen3D from "../3d/Screen3D";
import {toServerPath} from "../../utils/string";

const Img = styled("div")({
	height: 200,
})

const TitleStyle = styled(Link)({
	overflow: 'hidden',
	WebkitLineClamp: 2,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	textTransform: "uppercase"
});

export default function EquipmentCard({item}) {
	const [open, setOpen] = useState(false);
	const {file, name, description, id} = useMemo(() => item, [item])
	
	const handleOpen = useCallback(() => setOpen(true), [])
	const handleClose = useCallback(() => setOpen(false), [])
	
	const menu = useMemo(() => [
		{
			title: "Modifier",
			icon: ICON.update,
			link: `/dashboard/equipments/form/${id}`
		},
		{
			title: "Afficher",
			icon: ICON.eye,
			onClick: handleOpen
		},
		{
			title: "Supprimer",
			icon: ICON.delete,
			color: "text.accent",
			onClick: () => null
		}
	], [handleOpen, id])
	
	return <>
		<Grid item xs={12} sm={6} md={3}>
			<Card>
				<CardContent>
					<Stack flex direction="row" justifyContent="space-between">
						<TitleStyle
							to={`/dashboard/equipments/form/${id}`}
							color="inherit"
							variant="subtitle2"
							underline="hover"
							component={RouterLink}
						>
							{name}
						</TitleStyle>
						<MoreAction menus={menu}/>
					</Stack>
					<Typography sx={{color: "text.secondary"}} variant="body2" gutterBottom>
						{description?.slice(0, 100)}{description?.length > 100 ? "..." : null}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
		{
			open &&
			<Dialog
				open={open}
				maxWidth="md"
				onClose={handleClose}
			>
				<DialogTitle>{name}</DialogTitle>
				<DialogContent>
					<Screen3D file={toServerPath(file)} />
					<Typography align="justify" sx={{color: "text.secondary", mt: 2}} variant="h6" gutterBottom>
						Description
					</Typography>
					<Typography align="justify" variant="body2" gutterBottom>
						{description}
					</Typography>
				</DialogContent>
			</Dialog>
		}
	</>
}

EquipmentCard.propTypes = {
	item: PropTypes.object
};