import {Controller, useFormContext} from "react-hook-form";
import {RadioGroup} from "@mui/material";
import PropTypes from "prop-types";

export function RHFRadio({name, children, ...other}) {
	
	const {control} = useFormContext();
	
	return (
		<Controller
			name={name}
			control={control}
			render={({field}) => (
				<RadioGroup
					{...field}
					value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
					{...other}
				>
					{children}
				</RadioGroup>
			)}
		/>
	);
}

RHFRadio.propTypes = {
	name: PropTypes.string,
	children: PropTypes.node,
};