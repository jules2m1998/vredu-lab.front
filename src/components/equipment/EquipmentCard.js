import PropTypes from "prop-types";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Link,
	Stack,
	Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useCallback, useMemo, useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {MoreAction} from "../GenericArrays";
import {ICON} from "../../utils/const";
import Screen3D from "../3d/Screen3D";
import {toServerPath} from "../../utils/string";
import Iconify from "../Iconify";
import useDelete from "../../hooks/useDelete";
import ConfirmAlert from "../ConfirmAlert";

const TitleStyle = styled(Link)({
	overflow: 'hidden',
	WebkitLineClamp: 2,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	textTransform: "uppercase"
});

export default function EquipmentCard({item, onDelete}) {
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [loading, setLoading] = useState(false);
	const {file, name, description, id, typeEffect, isConstraint} = useMemo(() => item, [item])
	const deleteMethod = useDelete()
	
	const handleOpen = useCallback(() => setOpen(true), [])
	const handleClose = useCallback(() => setOpen(false), [])
	const handleDelete = useCallback(async () => {
		setLoading(true)
		await deleteMethod(`Equipment/${id}`, "Suppression effectuee avec succees")
		await onDelete()
		setLoading(false)
		setOpenDelete(false)
	}, [deleteMethod, id, onDelete]);
	
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
			onClick: () => setOpenDelete(true)
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
					{isConstraint ?
						<Chip
							variant="outlined"
							color="warning"
							size="small"
							label="Protection"
							icon={<Iconify icon={ICON.protect}/>}/> :
						<Chip
							variant="outlined"
							size="small"
							label="Materiel de laboratoire"
							icon={<Iconify icon={ICON.labTools}/>}/>
					}
					<Typography sx={{color: "text.secondary", mt: 1}} variant="body2" gutterBottom>
						{description?.slice(0, 100)}{description?.length > 100 ? "..." : null}
					</Typography>
					<Typography variant="body2" gutterBottom>
						Type d'effet : {typeEffect.name} ({typeEffect.unitySymbol})
					</Typography>
				</CardContent>
			</Card>
		</Grid>
		{
			open &&
			<Dialog
				open={open}
				maxWidth="md"
				fullWidth
				onClose={handleClose}
			>
				<DialogTitle>{name}</DialogTitle>
				<DialogContent>
					<Screen3D bg={0x003A52} bgOpacity={.2} file={toServerPath(file)}/>
					<Box sx={{mt:1}}>
						{isConstraint ?
							<Chip
								variant="outlined"
								color="warning"
								size="small"
								label="Protection"
								icon={<Iconify icon={ICON.protect}/>}/> :
							<Chip
								variant="outlined"
								size="small"
								label="Materiel de laboratoire"
								icon={<Iconify icon={ICON.labTools}/>}/>
						}
					</Box>
					<Typography align="justify" sx={{color: "text.secondary", mt: 2}} variant="h6" gutterBottom>
						Description
					</Typography>
					<Typography align="justify" variant="body2" gutterBottom>
						{description}
					</Typography>
					<Typography variant="body2" gutterBottom>
						Type d'effet : {typeEffect.name} ({typeEffect.unitySymbol})
					</Typography>
				</DialogContent>
			</Dialog>
		}
		<ConfirmAlert
			title={`Suppression de l'equipement : ${name}`}
			description="Voulez-vous vraiment supprimer cet equipement ?"
			open={openDelete}
			onClose={() => setOpenDelete(false)}
			onSuccess={handleDelete}
			isLoading={loading}
		/>
	</>
}

EquipmentCard.propTypes = {
	item: PropTypes.object,
	onDelete: PropTypes.func,
};