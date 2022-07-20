import {Container, Stack, Typography} from "@mui/material";
import Page from "../components/Page";
import EquipmentForm from "../components/EquipmentForm";

export default function RegisterEquipment () {
	return <Page title="Creer un mmateriel">
		<Container>
			<Stack>
				<Typography variant="h4" sx={{}}>
					Creation d'un equipement
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez les informations sur l'equpement a creer ci-dessous ! </Typography>
			</Stack>
			<Stack>
				<EquipmentForm />
			</Stack>
		</Container>
	</Page>
}