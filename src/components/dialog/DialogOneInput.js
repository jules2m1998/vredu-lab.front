import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";
import {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import {FormProvider, RHFTextField} from "../hook-form";
import useSnack from "../../hooks/useSnack";

DialogOneInput.propTypes = {
	onSubmit: PropTypes.func,
	onClose: PropTypes.func,
	open: PropTypes.bool,
	apiName: PropTypes.string,
	value: PropTypes.string,
	title: PropTypes.string,
	description: PropTypes.string,
	label: PropTypes.string,
}

export function DialogOneInput({onSubmit, onClose, open, apiName = "name", value = "", title, description, label}) {
	const alert = useSnack()
	
	const updateType = useMemo(() => Yup.object().shape({
		[apiName]: Yup.string().required("Ce champs est obligatoire !")
	}), [apiName])
	
	const defaultValues = useMemo(() => ({
		[apiName]: value
	}), [apiName, value])
	
	const methods = useForm({
		resolver: yupResolver(updateType),
		defaultValues
	})
	
	
	const beforeSendData = useCallback((e) => {
		if (e[apiName].trim() === value) {
			alert("Aucune modification effectuee !", {variant: 'warning'})
		} else {
			onSubmit(e)
		}
	}, [alert, apiName, onSubmit, value])
	
	const {
		handleSubmit,
		formState: {isSubmitting},
	} = methods;
	
	return (
		<Dialog open={open}>
			<FormProvider methods={methods}>
				<DialogTitle>
					{title}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{description}
					</DialogContentText>
					<RHFTextField sx={{mt: 3}} name={apiName} label={label}/>
				</DialogContent>
				<DialogActions>
					<LoadingButton
						type="button"
						onClick={handleSubmit(beforeSendData)}
						loading={isSubmitting}
						disabled={isSubmitting}>
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
	)
}