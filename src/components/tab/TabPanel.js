import {Box} from "@mui/material";
import PropTypes from "prop-types";

export default function TabPanel(props) {
	const {children, value, index, ...other} = props;
	
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{pt: 3}}>{children}</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node.isRequired,
	value: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
};