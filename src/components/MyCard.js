import {Card} from "@mui/material";
import PropTypes from "prop-types";

MyCard.propTypes = {
	children: PropTypes.node
}

export default function MyCard ({children}){
	return <Card sx={{p: 3}}>
		{children}
	</Card>
}
