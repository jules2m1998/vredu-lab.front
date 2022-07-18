import {Container, Stack, Typography} from "@mui/material";
import Page from "../components/Page";
import TextureForm from "../components/TextureForm";

export default function RegisterTexture() {
	return <Page title="Formulaire : Texture">
		<Container>
			<Stack>
				<Typography variant="h4" sx={{}}>
					Creation d'une texture
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez les informations sur la texture a creer ci-dessous ! </Typography>
			</Stack>
			<Stack>
				<TextureForm />
			</Stack>
		</Container>
	</Page>
}