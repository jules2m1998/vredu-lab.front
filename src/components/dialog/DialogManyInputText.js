import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useMemo} from "react";
import PropTypes from "prop-types";
import useFormMethods from "../../hooks/useFormMethods";
import {FormProvider, RHFTextField} from "../hook-form";

export default function DialogManyInputText({fields, open, onClose, title, description, onSubmit}) {
	const methods = useFormMethods(fields)
	const {handleSubmit, formState: {isSubmitting}} = useMemo(() => (methods), [methods])
	
	return <Dialog open={open}>
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<DialogTitle>
				{title}
			</DialogTitle>
			
			<DialogContent>
				<DialogContentText>
					{description}
				</DialogContentText>
				{
					fields.map(({name, label}, k) => <RHFTextField key={k} sx={{mt: 3}} name={name} label={label}/> )
				}
			</DialogContent>
			
			<DialogActions>
				<LoadingButton type="button" loading={isSubmitting} disabled={isSubmitting}>
					Enregistrer
				</LoadingButton>
				<Button
					disabled={isSubmitting}
					onClick={onClose}
					sx={{color: 'text.accent'}}
				>
					Annuler
				</Button>
			</DialogActions>
		</FormProvider>
	</Dialog>
}

DialogManyInputText.propTypes = {
	fields: PropTypes.array.isRequired,
	open: PropTypes.bool.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};