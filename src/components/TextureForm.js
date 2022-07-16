import {Grid, IconButton, MenuItem, Stack} from "@mui/material";
import * as Yup from "yup";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {LoadingButton} from "@mui/lab";
import MyCard from "./MyCard";
import {toFormData} from "../utils/object";
import {RequestContext} from "../http/RequestProvider";
import {FormProvider, RHFTextField} from "./hook-form";
import {DialogOneInput} from "./DialogOneInput";
import ImgFileDrag from "./ImgFileDrag";
import useSnack from "../hooks/useSnack";
import {HTTP_CONFIG} from "../http/request";
import Iconify from "./Iconify";
import {ICON} from "../utils/const";
import MySelectList from "./MySelectList";

const OneGroup = ({name, id, onReload}) => {
	const [open, setOpen] = useState(false)
	const request = useContext(RequestContext)
	
	const handleSubmit = useCallback(async (v) => {
		const data = await request.fetch(`TextureGroup/${id}?name=${v.name}`, {
			method: "put",
			successMsg: "Element modifie !"
		})
		if (data) {
			setOpen(false)
			onReload()
		}
		console.log(data)
	}, [id, onReload, request])
	
	return <>
		<MenuItem
			selected
			value={id}
		>
			<Stack flex flexDirection="row" gap={2} alignItems="center" justifyContent="center">
				<Stack flexDirection="row">
					<IconButton size="small">
						<Iconify icon={ICON.delete} sx={{color: "error.main"}}/>
					</IconButton>
					<IconButton size="small" onClick={() => setOpen(true)}>
						<Iconify icon={ICON.update} sx={{color: "text.secondary"}}/>
					</IconButton>
				</Stack>
				<option value={id}>{name}</option>
			</Stack>
			<DialogOneInput
				open={open}
				apiName="name"
				title="Modification d'un type de texture"
				description="Changer la valeur ci-dessous pour modifier ce type"
				onClose={() => setOpen(false)}
				label="Nom du groupe"
				value={name}
				onSubmit={handleSubmit}
			/>
		</MenuItem>
	</>
}

OneGroup.propTypes = {
	name: PropTypes.string,
	onReload: PropTypes.func,
	id: PropTypes.number,
}

export default function TextureForm() {
	const [, setLoading] = useState(false)
	const [groupActive, setGroupActive] = useState(null)
	const [groupActiveError, setGroupActiveError] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)
	const [file, setFile] = useState(null)
	const [open, setOpen] = useState(false)
	const [types, setTypes] = useState([])
	const request = useContext(RequestContext)
	const alert = useSnack()
	
	const reloadType = useCallback(() => {
		setLoading(true)
		request.fetch("TextureGroup").then(t => {
			if (t) setTypes(t)
			setLoading(false)
		})
	}, [request])
	
	useEffect(reloadType, [reloadType])
	
	const defaultValues = useMemo(() => ({
		Name: ""
	}), [])
	
	const RegisterSchema = Yup.object().shape({
		Name: Yup.string().required('Nom obligatoire !')
	});
	
	const methods = useForm({
		defaultValues,
		resolver: yupResolver(RegisterSchema)
	})
	
	const {handleSubmit, formState: {isSubmitting}} = useMemo(() => (methods), [methods])
	
	const onSubmit = useCallback(async (e) => {
		if (!file || !groupActive) return
		const formData = toFormData({...e, GroupId: groupActive, Image: file})
		await request.fetch("Texture", {
			method: "post",
			body: formData,
			config: HTTP_CONFIG.FORM_DATA,
			successMsg: "Texture cree avec succces !"
		})
	}, [file, groupActive, request])
	
	const handleClose = useCallback(() => setOpen(false), [])
	
	const handleCreateType = useCallback(async (e) => {
		console.log(e)
		const data = await request.fetch(`TextureGroup?name=${e.name}`, {
			method: "post",
			successMsg: "Type de texture cree !"
		})
		console.log(data)
		reloadType()
		setOpen(false)
	}, [reloadType, request])
	
	const handleVerify = useCallback(() => {
		if (!file) {
			alert("L'image est oblgatoire !", {variant: "warning"})
			setErrorMsg("L'image est obligatoire !")
		}
		if (!groupActive) {
			setGroupActiveError("Le type de texture est obligatoire !")
		}
	}, [alert, file, groupActive])
	
	const openDialog = useCallback(() => setOpen(true), [])
	const handleEditItem = useCallback(async (id, v) => {
		const data = await request.fetch(`TextureGroup/${id}?name=${v.name}`, {
			method: "put",
			successMsg: "Element modifie !"
		})
		if (data) {
			setOpen(false)
			await reloadType()
			return true
		}
		return false
	}, [reloadType, request])
	
	return <>
		<Grid container spacing={2}>
			<Grid item xs={3}>
				<MyCard>
					<ImgFileDrag disabled={isSubmitting} errorMsg={errorMsg} onChange={setFile}
					             onResetErrorMsg={() => setErrorMsg(null)}/>
				</MyCard>
			</Grid>
			<Grid item xs={9}>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<MyCard>
						<Stack spacing={2}>
							<RHFTextField disabled={isSubmitting} name="Name" label="Nom de la texture"/>
							<Stack alignItems="end">
								<MySelectList
									items={types}
									onOpenAdd={openDialog}
									onOneEdit={handleEditItem}
									onSelected={setGroupActive}
									active={groupActive}
									errorMsg={groupActiveError}
									onResetError={()  => setGroupActiveError(null)}
								/>
								<LoadingButton size="large" onClick={handleVerify} type="submit" variant="contained"
								               loading={isSubmitting}>
									Enregistrer
								</LoadingButton>
							</Stack>
						</Stack>
					</MyCard>
				</FormProvider>
			</Grid>
		</Grid>
		<DialogOneInput
			open={open}
			apiName="name"
			title="Creer un type de texture"
			description="Renseignez le nom ci-dessous"
			label="Nom du type"
			onClose={handleClose}
			onSubmit={handleCreateType}
		/>
	</>
}