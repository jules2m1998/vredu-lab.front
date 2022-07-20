import {useMemo} from "react";
import PropTypes from "prop-types";
import {LoadingButton} from "@mui/lab";
import {Stack} from "@mui/material";
import {FormProvider} from "./index";
import useFormMethods from "../../hooks/useFormMethods";


export default function FormGenerator({fields, onSubmit, onVerify, btnText, children, disabled = false}) {
	
	const methods = useFormMethods(fields)
	const {handleSubmit, formState: {isSubmitting}} = useMemo(() => (methods), [methods])
	
	return <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
		<Stack spacing={2}>
			{children}
			<Stack alignItems="end">
				<LoadingButton
					size="large"
					onClick={onVerify}
					type="submit"
					variant="contained"
					loading={isSubmitting}
					disabled={disabled}
				>
					{btnText}
				</LoadingButton>
			</Stack>
		</Stack>
	</FormProvider>
}

FormGenerator.propTypes = {
	fields: PropTypes.arrayOf(PropTypes.object).isRequired,
	onSubmit: PropTypes.func.isRequired,
	onVerify: PropTypes.func.isRequired,
	btnText: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	disabled: PropTypes.bool,
};