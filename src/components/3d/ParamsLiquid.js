import PropTypes from "prop-types";
import {SketchPicker} from "react-color";
import {Card, CardContent, Checkbox, FormControlLabel, Slider, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useCallback, useMemo, useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoadingButton} from "@mui/lab";
import FileDrag from "../hook-form/FileDrag";
import {FormProvider, RHFTextField} from "../hook-form";
import {getDiff, toFormData, toUpper} from "../../utils/object";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";

// const invert = ({r, g, b}) => ({
// 	r: 255 - r,
// 	g: 255 - g,
// 	b: 255 - b,
// })

const PickerBtn = styled("button")(({bg}) => ({
	background: typeof bg === 'number' ? `${bg}` : `rgba(${bg?.r}, ${bg?.g}, ${bg?.b}, ${bg?.a})`,
	height: 14,
	width: 36,
	borderRadius: '2px',
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
		onColorChange,
		onTextureChange,
		onPropChange,
		textureFile = {},
		defaultValue,
		setState,
		liquid,
		defaut,
	}) {
	const [display, setDisplay] = useState(false);
	
	const postMethod = usePost()
	const putMethod = usePut()
	
	const handleDisplayOpen = useCallback((e) => {
		e.preventDefault()
		e.stopPropagation()
		setDisplay(true)
	}, []);
	const handleDisplayClose = useCallback(() => {
		setDisplay(false)
	}, []);
	
	
	const defaultValues = useMemo(() => ({
		Name: defaut?.name || ""
	}), [defaut])
	
	const RegisterSchema = Yup.object().shape({
		Name: Yup.string().required('Nom obligatoire !')
	});
	
	const methods = useForm({
		defaultValues,
		resolver: yupResolver(RegisterSchema),
	})
	
	const onSubmit = useCallback(async (e) => {
		if (!defaut) {
			const data = toFormData(toUpper({...e, ...textureFile, TextureType: liquid ? 0 : 1, ...textureFile.color}))
			const result = await postMethod("Texture", "Enregistrement effectue", {data})
			console.log(result)
		} else {
			const txtCp = {...textureFile}
			if (typeof txtCp.color === 'string'){
				txtCp.color = defaut.color
			}
			const data = getDiff({name: e.Name, ...txtCp, textureType: liquid ? 0 : 1, ...txtCp.color}, {...defaut, ...defaut.color}, true)
			delete data.Color
			const result = await putMethod(`Texture/${defaut.id}`, "Modification effectue", {data: toFormData(data)})
			console.log(result)
		}
	}, [defaut, liquid, postMethod, putMethod, textureFile])
	
	const handleLiquid = useCallback((e) => {
		setState(e.target.checked)
	}, [setState]);
	
	const {handleSubmit, formState: {isSubmitting}} = useMemo(() => (methods), [methods])
	
	return <Card sx={{overflow: "visible"}}>
		<CardContent>
			<Stack spacing={5}>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={3}>
						<Stack>
							<RHFTextField name="Name" label="Nom de la texture"/>
						</Stack>
						<Stack>
							<div>
								<FormControlLabel disabled={isSubmitting} value={liquid} onChange={handleLiquid} control={<Checkbox defaultChecked={liquid}/>}
								                  label="Texture liquide ?"/>
							</div>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Couleur et transparence</Typography>
							<PickerBtn disabled={isSubmitting} bg={textureFile.color || defaultValue.color} onClick={handleDisplayOpen}/>
							{display &&
								<Color>
									<Cover onClick={handleDisplayClose}/>
									<SketchPicker color={textureFile.color || defaultValue.color} onChange={onColorChange}/>
								</Color>
							}
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture de rugosite</Typography>
							<FileDrag
								defaultImg={defaultValue.roughnessMap}
								onChange={onTextureChange('roughnessMap')}
								disabled={isSubmitting}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Rugosité</Typography>
							<Slider
								value={textureFile.roughness}
								step={.01}
								color="secondary"
								onChange={onPropChange("roughness")}
								defaultValue={defaultValue.roughness}
								valueLabelDisplay="auto"
								disabled={isSubmitting}
								max={1}
								min={0}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture metalique (metallic)</Typography>
							<FileDrag
								defaultImg={defaultValue.metalnessMap}
								onChange={onTextureChange('metalnessMap')}
								disabled={isSubmitting}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Metalique</Typography>
							<Slider
								value={textureFile.metalness}
								defaultValue={defaultValue.metalness}
								step={.01}
								color="secondary"
								valueLabelDisplay="auto"
								onChange={onPropChange("metalness")}
								disabled={isSubmitting}
								max={1}
								min={0}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture de couleur de base (base
								color)</Typography>
							<FileDrag
								defaultImg={defaultValue.map}
								onChange={onTextureChange('map')}
								disabled={isSubmitting}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture de couleur normale
								(normal)</Typography>
							<FileDrag onChange={onTextureChange('normalMap')}/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture de relief (height)</Typography>
							<FileDrag
								onChange={onTextureChange('displacementMap')}
								defaultImg={defaultValue.displacementMap}
								disabled={isSubmitting}
							/>
							<Typography sx={{mt: 1}} variant="subtitle2" display="block" gutterBottom>Niveau de relief</Typography>
							<Slider
								aria-label="Temperature"
								value={textureFile.displacementScale}
								defaultValue={defaultValue.displacementScale}
								step={.01}
								color="secondary"
								valueLabelDisplay="auto"
								onChange={onPropChange("displacementScale")}
								disabled={isSubmitting}
								max={1}
								min={0}
							/>
						</Stack>
						<Stack>
							<Typography variant="subtitle2" display="block" gutterBottom>Texture d'ombre
								(ambientOcclusion)</Typography>
							<FileDrag
								defaultImg={defaultValue.aoMap}
								onChange={onTextureChange('aoMap')}
								disabled={isSubmitting}
							/>
						</Stack>
						<Stack alignItems="end">
							<LoadingButton
								size="large"
								type="submit"
								variant="contained"
								loading={isSubmitting}>
								{
									"Enregistrer"
								}
							</LoadingButton>
						</Stack>
					</Stack>
				</FormProvider>
			</Stack>
		</CardContent>
	</Card>
}

ParamsLiquid.propTypes = {
	onColorChange: PropTypes.func.isRequired,
	onTextureChange: PropTypes.func,
	onPropChange: PropTypes.func,
	textureFile: PropTypes.object,
	defaultValue: PropTypes.object,
	liquid: PropTypes.bool,
	setState: PropTypes.func,
	name: PropTypes.string,
	defaut: PropTypes.object,
};