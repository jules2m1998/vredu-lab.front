import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";
import {LoadingButton} from "@mui/lab";

ConfirmAlert.propTypes = {
	open: PropTypes.bool,
	isLoading: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	onClose: PropTypes.func,
	onSuccess: PropTypes.func
}

export default function ConfirmAlert({open, onClose, onSuccess, title, description, isLoading}){
	return <Dialog
		open={open}
		aria-labelledby="draggable-dialog-title"
	>
		<DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
			{title}
		</DialogTitle>
		<DialogContent>
			<DialogContentText>
				{description}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<LoadingButton loading={isLoading} onClick={onSuccess} >
				Supprimer
			</LoadingButton>
			<Button disabled={isLoading} autoFocus onClick={onClose} sx={{color: "text.accent"}}>
				Annuler
			</Button>
		</DialogActions>
	</Dialog>
}