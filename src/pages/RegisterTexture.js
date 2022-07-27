import {Container, Stack, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import Page from "../components/Page";
import WaterTextureScreen from "../components/3d/WaterTextureScreen";
import Loader from "../components/Loaders/Loader";
import useGet from "../hooks/useGet";
import {getDecantObject} from "../utils/object";

const defV = {
	metalnessMap: null,
	metalness: .0,
	roughnessMap: null,
	roughness: 1.0,
	map: null,
	normalMap: null,
	displacementMap: null,
	displacementScale: .05,
	aoMap: null,
	color: 0xffffff,
	opacity: 1
}
export default function RegisterTexture() {
	const {id} = useParams()
	const [current, setCurrent] = useState(null);
	const [loading, setLoading] = useState(false);
	const getMethod = useGet()
	const [name, setName] = useState("");
	const [type, setType] = useState(0);
	const [defaultV, setDefaultV] = useState(null);
	
	const defaultVal = useMemo(() => current || defV, [current]);
	
	
	useEffect(() => {
		if (id) {
			setLoading(true)
			getMethod(`Texture/${id}`).then(data => {
				const value = getDecantObject(data, data.parent)
				const copy = Object.keys(defV).reduce((acc, current) => ({...acc, [current]: value[current]}), {})
				if (data) {
					setDefaultV(data)
					setName(data.name)
					setType(data.textureType)
					setCurrent(
						{
							...copy,
							color: `rgb(${data.color.r},${data.color.g},${data.color.b})`,
							opacity: data.color.a
						}
					)
				}
				setLoading(false)
			})
		}
	}, [getMethod, id]);
	
	
	if (loading) return <Loader text="Recherche de la texture..."/>
	
	return <Page title="Formulaire : Texture">
		<Container>
			<Stack>
				<Typography variant="h4" sx={{}}>
					Creation d'une texture
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez les informations sur la texture a creer ci-dessous
					! </Typography>
			</Stack>
			<Stack>
				<WaterTextureScreen defaut={defaultV} name={name} defaultValue={defaultVal} radius={8} type={type}/>
			</Stack>
		</Container>
	</Page>
}