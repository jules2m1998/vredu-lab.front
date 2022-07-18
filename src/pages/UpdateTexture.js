import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {Container, Stack, Typography} from "@mui/material";
import TextureForm from "../components/TextureForm";
import Page from "../components/Page";
import Loader from "../components/Loader";
import useGet from "../hooks/useGet";

export const UpdateTexture = () => {
	
	const {id} = useParams()
	const [texture, setTexture] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate()
	
	const getMethod = useGet()
	const getTexture = useCallback(async () => {
		setLoading(true)
		const data = await getMethod(`Texture/${id}`, null)
		if (data) {
			setTexture(data)
		} else {
			navigate("/dashboard/textures/list")
		}
		setLoading(false)
	}, [getMethod, id, navigate]);
	
	useEffect(()=>{
		getTexture()
	}, [getTexture]);
	
	if (loading) return <Loader text="Recherche de la texture..." />
	
	return (<Page title="Formulaire de modification : Texture">
		<Container>
			<Stack>
				<Typography variant="h4" sx={{}}>
					Mofifier une texture
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez les informations sur la texture a modifier ci-dessous ! </Typography>
			</Stack>
			<Stack>
				<TextureForm onSetTexture={setTexture} texture={texture} />
			</Stack>
		</Container>
	</Page>
	);
}