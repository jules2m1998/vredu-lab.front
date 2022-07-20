import PropTypes from "prop-types";
import {useCallback, useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {Button, Stack} from "@mui/material";
import Screen3D from "./Screen3D";
import Iconify from "../Iconify";
import {ICON} from "../../utils/const";

const Img = styled('img')(() => ({
	width: '100%',
	height: 300,
	objectFit: "contain",
	border: "1px solid #00000029",
	borderRadius: 8
}))


export default function FileDisplay3D({defaultFile}) {
	
	const [file, setFile] = useState(null);
	const fileInput = useRef(null)
	
	const handleChange = (e) => {
		setFile(URL.createObjectURL(e.target.files[0]));
	}
	const openFile = useCallback(() => fileInput.current.click(), [])
	
	return <Stack flex alignItems="center" justifyItems="center">
		{file && <Screen3D file={file}/>}
		{!file && <Img src='/default3d.webp' alt="3d upload default !"/>}
		
		<input ref={fileInput} accept="image/*" type='file' id="imgInp" onChange={handleChange} hidden/>
		<Button
			onClick={openFile}
			startIcon={<Iconify icon={ICON.imageAdd}/>}
		>{file ? "Changer la photo !" : "Ajouter une photo"}</Button>
	</Stack>
}

FileDisplay3D.propTypes = {
	defaultFile: PropTypes.object
};