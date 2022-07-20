import {Grid} from "@mui/material";
import MyCard from "./MyCard";
import FileDisplay3D from "./3d/FileDisplay3D";


export default function EquipmentForm () {
	return <>
		<Grid container spacing={2}>
			<Grid item xs={5}>
				<MyCard>
					<FileDisplay3D />
				</MyCard>
			</Grid>
			<Grid item xs={7}>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur aut eligendi exercitationem harum id qui temporibus tenetur voluptatum. Ad dignissimos esse pariatur quam, quis totam ut voluptatum. Delectus, deleniti quos?
			</Grid>
		</Grid>
	</>
}