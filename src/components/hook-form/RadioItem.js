import {FormControlLabel, Radio} from "@mui/material";
import PropTypes from "prop-types";

export default function RadioItem ({value, label, ...other}){
	return <FormControlLabel value={value} control={<Radio/>} {...other} label={label}/>
}

RadioItem.propTypes = {
	value: PropTypes.string,
	label: PropTypes.string,
};