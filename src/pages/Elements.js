import {
	Button,
	Container,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import useGet from "../hooks/useGet";
import Loader from "../components/Loaders/Loader";
import TextureScreen from "../components/3d/TextureScreen";
import {Molecule as Mol} from "../style";

const Atom = styled('div')(() => ({
	display: "flex",
	gap: 6,
	flexWrap: 'wrap',
	".item": {
		width: 100,
		textTransform: 'capitalize',
		border: "1px solid black",
		borderRadius: 5,
		display: 'flex',
		flexDirection: 'column',
		padding: 3,
		gap: 1,
		alignItems: "center",
		cursor: "pointer",
	}
}))

const Molecule = styled('div')(() => ({
	display: "flex",
	gap: 6,
	flexWrap: 'wrap',
	".item": {
		textTransform: 'capitalize',
		border: "1px solid black",
		borderRadius: 5,
		display: 'flex',
		flexDirection: 'column',
		padding: 3,
		gap: 1,
		alignItems: "center",
		cursor: "pointer",
	}
}))

const AtomItem = ({item}) => {
	const [open, setOpen] = useState(false);
	
	return <>
		<button
			className="item"
			onClick={() => setOpen(true)}
			type="button"
		>
			<Typography variant="caption">{item.name}</Typography>
			<Typography variant="caption">{item.atomicNumber}</Typography>
			<Typography variant="h6" textTransform="capitalize">{item.symbol}</Typography>
			<Typography variant="caption">{item.massNumber}</Typography>
		</button>
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{item.name}</DialogTitle>
			<DialogContent>
				<Stack alignItems="center" sx={{pb: 2}}>
					<TextureScreen liquid={item.texture?.textureType === 0} texture={item.texture} />
				</Stack>
				<DialogContentText>
					{item.description}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	</>
}

AtomItem.propTypes = {
	item: PropTypes.object
}

const MoleculeItem = ({item}) => {
	const [open, setOpen] = useState(false);
	
	return <>
		<button
			className="item"
			onClick={() => setOpen(true)}
			type="button"
		>
			<Typography variant="caption">{item.name}</Typography>
			<Stack direction="row">
				{
					item.children.map((value, k) => <Mol key={k}>
						<Typography variant="h6">{value.children.symbol}</Typography>
						{value.quantity > 1 && <Typography className="indice">{value.quantity}</Typography>}
					</Mol>)
				}
			</Stack>
			<Typography variant="caption">De : {item.user.userName}</Typography>
		</button>
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{item.name}</DialogTitle>
			<DialogContent>
				<Stack alignItems="center" sx={{pb: 2}}>
					<TextureScreen liquid={item.texture?.textureType === 0} texture={item.texture} />
				</Stack>
				<DialogContentText>
					{item.description}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	</>
}

MoleculeItem.propTypes = {
	item: PropTypes.object
}

export default function Elements() {
	const [loading, setLoading] = useState(true);
	const [element, setElement] = useState([]);
	const getMethod = useGet()
	
	const fetchAll = useCallback(async () => {
		const data = await getMethod("Element")
		setElement(data)
		setLoading(false)
	}, [getMethod]);
	
	const separateElt = useMemo(() => element.reduce((acc, current) => {
		if (current.children.length) return {...acc, molecule: [...acc.molecule, current]}
		return {...acc, atom: [...acc.atom, current]}
	}, {molecule: [], atom: []}), [element]);
	
	useEffect(() => {
		fetchAll()
	}, [fetchAll]);
	
	if (loading) return <Loader text="Chargement des elements..."/>
	
	return <Page title="Elements chimiques">
		<Container>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					Liste des elements
				</Typography>
				<Button
					variant="contained"
					component={RouterLink}
					to="/dashboard/elements/form"
					startIcon={<Iconify icon="eva:plus-fill"/>}
				>
					Nouvelle element
				</Button>
			</Stack>
			<Stack spacing={6}>
				<Stack>
					<Typography variant="h6" gutterBottom>
						Atomes
					</Typography>
					<Atom>
						{
							separateElt.atom.sort((a, b) => a.atomicNumber - b.atomicNumber).map((i, k) => <AtomItem key={k} item={i}/>)
						}
					</Atom>
				</Stack>
				<Stack>
					<Typography variant="h6" gutterBottom>
						Molecules
					</Typography>
					<Molecule>
						{
							separateElt.molecule.map((elt, k) => <MoleculeItem item={elt} key={k} />)
						}
					</Molecule>
				</Stack>
			</Stack>
		</Container>
	</Page>
}