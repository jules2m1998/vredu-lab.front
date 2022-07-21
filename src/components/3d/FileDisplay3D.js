import PropTypes from "prop-types";
import {useCallback, useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {Button, Stack, Typography} from "@mui/material";
import Screen3D from "./Screen3D";
import Iconify from "../Iconify";
import {ICON} from "../../utils/const";

const Img = styled('img')(({theme,error}) => ({
	width: '100%',
	height: 300,
	objectFit: "contain",
	border: `1px solid ${!error ? "#0000001f" : theme.palette.error.main }`,
	borderRadius: 8
}))


export default function FileDisplay3D({defaultFile = null, onSetFile, error = null, onSetError, disabled}) {
	const fileInput = useRef(null)
	const [file, setFile] = useState(defaultFile);
	
	const handleChange = (e) => {
		onSetError(null)
		setFile(URL.createObjectURL(e.target.files[0]));
		onSetFile(e.target.files[0]);
	}
	const openFile = useCallback(() => fileInput.current.click(), [])
	
	return <Stack flex alignItems="center" justifyItems="center" spacing={1}>
		{file && <Screen3D file={file} error={error}/>}
		{!file && <Img src='/default3d.webp' alt="3d upload default !" error={error}/>}
		<input ref={fileInput} accept=".glb" type='file' id="imgInp" onChange={handleChange} hidden/>
		{
			error && <Typography variant="caption" align="center" sx={{color: "error.main"}}>{error}</Typography>
		}
		<Button
			onClick={openFile}
			startIcon={<Iconify icon={ICON.imageAdd}/>}
			disabled={disabled}
		>{file ? "Changer la photo !" : "Ajouter une photo"}</Button>
	</Stack>
}

FileDisplay3D.propTypes = {
	error: PropTypes.string,
	onSetFile: PropTypes.func.isRequired,
	onSetError: PropTypes.func,
	defaultFile: PropTypes.string,
	disabled: PropTypes.bool,
};