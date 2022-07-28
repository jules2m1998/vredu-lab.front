import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import {useCallback, useMemo, useState} from "react";
import {
	Box, Button,
	Dialog, DialogContent,
	DialogTitle,
	IconButton,
	ListItemButton,
	ListItemText,
	Stack, Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {Select} from "../style";
import {getDecantObject} from "../utils/object";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import TextureScreen from "./3d/TextureScreen";

const List = styled('div')(({theme, align}) => ({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	alignItems: align,
	gap: 5,
	".Mui-selected": {
		background: theme.palette.primary.lighter,
		border: `1px solid ${theme.palette.primary.dark}`
	}
}))

const TextureItem = ({texture, active, onChange, onResetError}) => {
	const [open, setOpen] = useState(false);
	const openPreview = useCallback((e) => {
		e.stopPropagation()
		setOpen(true)
	}, []);
	const setActive = useCallback(() => {
		onResetError()
		onChange(texture.id)
	}, [onChange, onResetError, texture.id]);
	return <>
		<ListItemButton
			sx={{border: "1px solid rgba(0,0,0,.13)"}}
			divider
			dense
			selected={texture.id === active}
			onClick={setActive}
		>
			<ListItemText primary={texture.name}/>
			
			<IconButton size="small" onClick={openPreview}>
				<Iconify icon={ICON.eye} sx={{color: "primary.main"}}/>
			</IconButton>
		</ListItemButton>
		{
			open && <Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>
					{texture.name}
				</DialogTitle>
				<DialogContent sx={{width: 450}}>
					<TextureScreen liquid={texture.textureType === 0} texture={texture}/>
				</DialogContent>
			</Dialog>
		}
	</>
}


TextureItem.propTypes = {
	texture: PropTypes.object.isRequired,
	active: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	onResetError: PropTypes.func,
};

export default function TextureSelect(
	{
		maxHeight = 200,
		textures,
		active,
		onChange,
		errorMsg,
		onResetError = () => null
	}
) {
	const items = useMemo(() => textures.map(value => {
		const item = getDecantObject(value, value.parent)
		delete item.parent
		return item
	}), [textures]);
	return <List>
		{
			items.length ?
				<Box>
					<Select maxheight={maxHeight} error={errorMsg ? 1 : 0}>
						<List sx={{width: "100%"}}>
							{
								items.map((v, k) => <TextureItem onResetError={onResetError} active={active} onChange={onChange} key={k}
								                                 texture={v}/>)
							}
						</List>
					</Select>
					<Typography variant="caption" align="center"
					            sx={{color: "error.main", marginLeft: "14px"}}>{errorMsg}</Typography>
				</Box> : <Stack flex direction="row" spacing={1} alignItems="center">
					<Typography variant="caption" sx={{color: 'text.secondary'}}>
						Aucun element trouve veillez en creer
					</Typography>
					<Button
						sx={{mb: 2}}
						component={RouterLink}
						to="/dashboard/textures/form"
						size="small"
					>Creer</Button>
				</Stack>
		}
	</List>
}

TextureSelect.propTypes = {
	maxHeight: PropTypes.number,
	errorMsg: PropTypes.string,
	textures: PropTypes.arrayOf(PropTypes.object),
	active: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	onResetError: PropTypes.func,
};