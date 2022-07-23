import {Grid, Stack} from "@mui/material";
import * as Yup from "yup";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import MyCard from "./MyCard";
import {toFormData} from "../utils/object";
import {RequestContext} from "../http/RequestProvider";
import {FormProvider, RHFCheckbox, RHFTextField} from "./hook-form";
import {DialogOneInput} from "./dialog/DialogOneInput";
import useSnack from "../hooks/useSnack";
import {HTTP_CONFIG} from "../http/request";
import MySelectList from "./MySelectList";
import usePut from "../hooks/usePut";
import useDelete from "../hooks/useDelete";
import useGet from "../hooks/useGet";
import WaterTextureScreen from "./3d/WaterTextureScreen";

TextureForm.propTypes = {
	texture: PropTypes.object,
	onSetTexture: PropTypes.func,
}

export default function TextureForm({texture = {}, onSetTexture = null}) {
	const [, setLoading] = useState(false)
	const [groupActive, setGroupActive] = useState(null)
	const [groupActiveError, setGroupActiveError] = useState(null)
	const [file, ] = useState(null)
	const [open, setOpen] = useState(false)
	const [types, setTypes] = useState([])
	const request = useContext(RequestContext)
	const alert = useSnack()
	const navigate = useNavigate();
	const putMethod = usePut()
	const deleteMethod = useDelete();
	const getMethod = useGet()
	
	const getGroup = useCallback(async () => {
		setLoading(true)
		const data = await getMethod('TextureGroup')
		if (data) setTypes(data)
		setLoading(false)
	}, [getMethod]);
	
	const reloadType = useCallback(() => {
		if (texture?.group?.id) setGroupActive(texture?.group?.id)
		setLoading(true)
		getGroup()
	}, [getGroup, texture?.group?.id])
	
	useEffect(reloadType, [reloadType])
	
	const defaultValues = useMemo(() => ({
		Name: texture?.name || "",
		IsLiquid: false,
		
	}), [texture])
	
	const RegisterSchema = Yup.object().shape({
		Name: Yup.string().required('Nom obligatoire !'),
		IsLiquid: Yup.string(),
	});
	
	const methods = useForm({
		defaultValues,
		resolver: yupResolver(RegisterSchema),
	})
	
	const {handleSubmit, formState: {isSubmitting}, watch} = useMemo(() => (methods), [methods])
	const watchShowAge = watch("IsLiquid", false);
	
	const onSubmit = useCallback(async (e) => {
		if (!texture?.id) {
			const formData = toFormData({...e, GroupId: groupActive, Image: file})
			if (!file || !groupActive) return
			const data = await request.fetch("Texture", {
				method: "post",
				body: formData,
				config: HTTP_CONFIG.FORM_DATA,
				successMsg: "Texture cree avec succces !"
			})
			if (data) navigate("/dashboard/textures/list")
		} else {
			const body = {}
			if (groupActive !== texture?.group?.id) {
				body.GroupId = groupActive
			}
			if (file) {
				body.Image = file
			}
			if (e.Name?.trim() !== texture.name?.trim()) {
				body.Name = e.Name
			}
			if (!Object.entries(body).length >= 1) {
				alert("Aucune information modifiee !", {variant: "warning"})
			} else {
				body.Id = texture?.id
				const data = await putMethod("Texture", "Texture modifiee !", {data: toFormData(body)})
				if (data) onSetTexture(data)
			}
		}
		
	}, [alert, file, groupActive, navigate, onSetTexture, putMethod, request, texture])
	
	const handleClose = useCallback(() => setOpen(false), [])
	
	const handleCreateType = useCallback(async (e) => {
		await request.fetch(`TextureGroup?name=${e.name}`, {
			method: "post",
			successMsg: "Type de texture cree !"
		})
		reloadType()
		setOpen(false)
	}, [reloadType, request])
	
	const handleVerify = useCallback(() => {
		if (!texture?.id) {
			if (!file) {
				alert("L'image est oblgatoire !", {variant: "warning"})
			}
			if (!groupActive) {
				setGroupActiveError("Le type de texture est obligatoire !")
			}
		}
	}, [alert, file, groupActive, texture])
	
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
	const handleDeleteGroup = useCallback(async (id) => {
		await deleteMethod(`TextureGroup/${id}`, "Supression effectuee avec succes !")
		if (texture?.group?.id === id) {
			navigate("/dashboard/textures/list")
		}
		await getGroup()
	}, [deleteMethod, getGroup, navigate, texture]);
	
	return <>
		<Grid container spacing={2}>
			<Grid item xs={5}>
				<WaterTextureScreen radius={8} liquid={watchShowAge}/>
			</Grid>
			<Grid item xs={7}>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<MyCard>
						<Stack spacing={2}>
							<RHFTextField disabled={isSubmitting} name="Name" label="Nom de la texture"/>
							<div>
								<RHFCheckbox name="IsLiquid" label="Texture liquide ?"/>
							</div>
							<Stack alignItems="end">
								<MySelectList
									items={types}
									onOpenAdd={openDialog}
									onOneEdit={handleEditItem}
									onSelected={setGroupActive}
									active={groupActive}
									errorMsg={groupActiveError}
									onResetError={() => setGroupActiveError(null)}
									loading={isSubmitting}
									onDeleteOne={handleDeleteGroup}
								/>
								<LoadingButton
									size="large"
									onClick={handleVerify}
									type="submit"
									variant="contained"
									loading={isSubmitting}>
									{
										texture?.id ? "Modifier" : "Enregistrer"
									}
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