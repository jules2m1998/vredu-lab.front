import PropTypes from "prop-types";
import {SketchPicker} from "react-color";
import {Card, CardContent, Slider, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useCallback, useState} from "react";

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
		onRoughnessChange
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
};