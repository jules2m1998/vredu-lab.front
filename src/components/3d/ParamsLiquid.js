import PropTypes from "prop-types";
import {SketchPicker} from "react-color";
import {Card, CardContent, Slider, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useCallback, useState} from "react";
import FileDrag from "../hook-form/FileDrag";

const PickerBtn = styled("button")(({bg}) => ({
	background: `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`,
	height: 14,
	width: 36,
	borderRadius: '2px',
	border: `1px solid rgb(${bg.r}, ${bg.g}, ${bg.b})`,
	cursor: "pointer"
}))

const Color = styled("div")(() => ({
	position: "absolute",
	paddingTop: 6,
	zIndex: 110000000
}))

const Cover = styled("div")(() => ({
	position: 'fixed',
	top: '0px',
	right: '0px',
	bottom: '0px',
	left: '0px'
}))


export default function ParamsLiquid(
	{
		color,
		onColorChange,
		metalness,
		onMetalnessChange,
		reflectivity,
		onReflectivityChange,
		roughness,
		onRoughnessChange,
		onTextureChange,
		onPropChange,
		textureFile
	}) {
	const [display, setDisplay] = useState(false);
	
	const handleDisplayOpen = useCallback((e) => {
		e.stopPropagation()
		setDisplay(true)
	}, []);
	const handleDisplayClose = useCallback(() => {
		setDisplay(false)
	}, []);
	
	return <Card sx={{overflow: "visible"}}>
		<CardContent>
			<Stack spacing={5}>
				<Stack spacing={3}>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Couleur et transparence</Typography>
						<PickerBtn bg={color} onClick={handleDisplayOpen}/>
						{display &&
							<Color>
								<Cover onClick={handleDisplayClose}/>
								<SketchPicker color={color} onChange={onColorChange}/>
							</Color>
						}
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Rugosité</Typography>
						<Slider
							aria-label="Temperature"
							value={roughness}
							step={.01}
							color="secondary"
							onChange={onRoughnessChange}
							valueLabelDisplay="auto"
							max={1}
							min={0}
						/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Metalique</Typography>
						<Slider
							aria-label="Temperature"
							value={metalness}
							step={.01}
							color="secondary"
							valueLabelDisplay="auto"
							onChange={onMetalnessChange}
							max={1}
							min={0}
						/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Réflexivité</Typography>
						<Slider
							aria-label="Temperature"
							value={reflectivity}
							step={.01}
							color="secondary"
							valueLabelDisplay="auto"
							onChange={onReflectivityChange}
							max={1}
							min={0}
						/>
					</Stack>
				</Stack>
				<Stack spacing={3}>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Texture de couleur de base (base color)</Typography>
						<FileDrag onChange={onTextureChange('map')}/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Texture de couleur normale (normal)</Typography>
						<FileDrag onChange={onTextureChange('normalMap')}/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Texture de relief (height)</Typography>
						<FileDrag onChange={onTextureChange('displacementMap')}/>
						<Typography sx={{mt:1}} variant="subtitle2" display="block" gutterBottom>Niveau de relief</Typography>
						<Slider
							aria-label="Temperature"
							value={textureFile.displacementScale}
							step={.01}
							color="secondary"
							valueLabelDisplay="auto"
							onChange={onPropChange("displacementScale")}
							max={1}
							min={0}
						/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Texture d'ombre (ambientOcclusion)</Typography>
						<FileDrag onChange={onTextureChange('aoMap')}/>
					</Stack>
					<Stack>
						<Typography variant="subtitle2" display="block" gutterBottom>Texture metalique (metallic)</Typography>
						<FileDrag onChange={onTextureChange('metalnessMap')}/>
					</Stack>
				</Stack>
			</Stack>
		</CardContent>
	</Card>
}

ParamsLiquid.propTypes = {
	color: PropTypes.object.isRequired,
	metalness: PropTypes.number.isRequired,
	reflectivity: PropTypes.number.isRequired,
	roughness: PropTypes.number.isRequired,
	onMetalnessChange: PropTypes.func.isRequired,
	onReflectivityChange: PropTypes.func.isRequired,
	onRoughnessChange: PropTypes.func.isRequired,
	onColorChange: PropTypes.func.isRequired,
	onTextureChange: PropTypes.func,
	onPropChange: PropTypes.func,
	textureFile: PropTypes.object
};