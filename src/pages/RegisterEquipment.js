import {Container, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Page from "../components/Page";
import EquipmentForm from "../components/EquipmentForm";
import useGet from "../hooks/useGet";
import Loader from "../components/Loaders/Loader";

export default function RegisterEquipment() {
	const [current, setCurrent] = useState(null);
	const [loading, setLoading] = useState(false);
	const getMethod = useGet()
	const {id} = useParams()
	const navigate = useNavigate()
	
	const init = useCallback(async () => {
		setLoading(true)
		const data = await getMethod(`Equipment/${id}`)
		if (data) {
			const {name, description, isConstraint, file} = data
			setCurrent({name, description,typeEffectId: data.typeEffect?.id , isConstraint: isConstraint.toString(), file, id})
			return data
		}
		return null
		
	}, [getMethod, id]);
	
	useEffect(() => {
		if (id) {
			init().then(d => {
				setLoading(false)
				if (!d) {
					navigate("/dashboard/equipments/list")
				}
			})
		}
	}, [id, init, navigate]);
	
	
	return <Page title={`${current? "Modifier" : "Creer"} un materiel`}>
		<Container>
			<Stack>
				<Typography variant="h4">
					{current? "Modification" : "Creation "} d'un equipement
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez les informations sur l'equpement a {current? "modifier" : "creer"} ci-dessous
					! </Typography>
			</Stack>
			<Stack>
				{!loading ? <EquipmentForm current={current}/> : <Loader text="Chargement de l'equpement" /> }
			</Stack>
		</Container>
	</Page>
}