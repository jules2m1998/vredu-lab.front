import {styled,} from "@mui/material/styles";
import {Button, Stack, Typography} from "@mui/material";
import {useCallback, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import {pulseAnimation} from "../style";
import {toServerPath} from "../utils/string";


export const Img = styled('img')(({isrounded = false, iserror = false, width = 200, height = 200}) => ({
	width,
	height,
	objectFit: "cover",
	borderRadius: isrounded ? "50%" : 6,
	animationName: pulseAnimation,
	animationDuration: iserror && '1s',
	animationTimingFunction: iserror && "ease-out",
	animationIterationCount: iserror && "infinite",
	animationPlayState: iserror && "running",
	border: "1px solid rgba(0,0,0,.13)"
}));

ImgFileDrag.propTypes = {
	isRounded: PropTypes.bool,
	disabled: PropTypes.bool,
	errorMsg: PropTypes.string,
	onResetErrorMsg: PropTypes.func,
	onChange: PropTypes.func,
	width: PropTypes.oneOfType([
		PropTypes.number, PropTypes.string
	]),
	height: PropTypes.oneOfType([
		PropTypes.number, PropTypes.string
	]),
	defaultImage: PropTypes.string
}

export default function ImgFileDrag(
	{
		onChange,
		isRounded = false,
		disabled = false,
		width = 200,
		height = 200,
		errorMsg = null,
		onResetErrorMsg,
		defaultImage
	}
) {
	const [file, setFile] = useState(null);
	const fileInput = useRef(null)
	
	const handleChange = (e) => {
		onResetErrorMsg()
		setFile(URL.createObjectURL(e.target.files[0]));
		onChange(e.target.files[0])
	}
	const openFile = useCallback(() => fileInput.current.click(), [])
	const pic = useMemo(() => {
		if (file) return file
		if (!defaultImage) return "https://www.thelist.travel/images/default-img.png"
		return defaultImage?.startsWith("http") ? defaultImage : toServerPath(defaultImage)
	}, [defaultImage, file]);
	
	return <Stack flex alignItems="center" justifyItems="center">
		<Stack spacing={2}>
			<Img width={width} height={height} isrounded={isRounded ? 1 : 0} iserror={errorMsg ? 1 : 0}
			     src={pic} alt="Test"/>
			{
				errorMsg && <Typography variant="caption" align="center" sx={{color: "error.main"}}>{errorMsg}</Typography>
			}
			<input ref={fileInput} accept="image/*" type='file' id="imgInp" onChange={handleChange} hidden/>
			<Button disabled={disabled} onClick={openFile}
			        startIcon={<Iconify icon={ICON.imageAdd}/>}>{file ? "Changer la photo !" : "Ajouter une photo"}</Button>
		</Stack>
	</Stack>
}