import {useCallback, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import {Button, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {toServerPath} from "../../utils/string";

const Div = styled('div')(() => ({
	display: 'flex',
	justifyContent: "space-between",
	border: '1px solid rgba(0, 0, 0, 0.18)',
	borderRadius: 8,
	padding: 4,
	"& img": {
		width: 35,
		height: 35,
		objectFit: 'contain',
		borderRadius: 3
	},
	"&>div": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
	}
}))


export default function FileDrag(
	{
		extensions = ["JPG", "PNG", "GIF"],
		onChange,
		defaultImg,
		disabled = false
	}
) {
	const [name, setName] = useState(null);
	const [file, setFile] = useState(null);
	
	const accept = useMemo(() => extensions.reduce((acc, current) => acc === "" ? `.${current.toLowerCase()}` : `${acc},.${current.toLowerCase()}`, ""), [extensions]);
	const input = useRef(null);
	
	const handleOpen = useCallback(() => input.current.click(), []);
	
	const handleChange = useCallback((e) => {
		onChange(e.target.files[0])
		setFile(URL.createObjectURL(e.target.files[0]))
		setName(e.target.files[0].name)
	}, [onChange]);
	
	const filename = useMemo(() => {
		const nbr = 50
		if (!name) return null
		if (name.length < nbr) return name
		return `${name.slice(0, nbr)}...`
	}, [name]);
	
	const path = useMemo(() => {
		if (file) return file
		if (!defaultImg) return '/default.png'
		if (defaultImg.startsWith("data:")) return defaultImg
		return toServerPath(defaultImg)
	}, [defaultImg, file]);
	
	const label = useMemo(() =>{
		if (filename) return filename
		if (defaultImg) return "Fichier existant !"
		return 'Aucun fichier !'
	}, [defaultImg, filename]);
	
	return <>
		<input ref={input} accept={accept} type="file" onChange={handleChange} hidden/>
		<Div>
			<div>
				<Button disabled={disabled} onClick={handleOpen} size='small' variant="contained">Ajouter un fichier</Button>
				<Typography variant="caption">{label}</Typography>
			</div>
			<img src={path} alt="Defaut"/>
		</Div>
	</>
}

FileDrag.propTypes = {
	extensions: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	defaultImg: PropTypes.string
};