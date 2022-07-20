import {FormControl, FormLabel, Grid} from "@mui/material";
import {useCallback, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import MyCard from "./MyCard";
import FileDisplay3D from "./3d/FileDisplay3D";
import FormGenerator from "./hook-form/FormGenerator";
import {RHFTextField} from "./hook-form";
import {RHFRadio} from "./hook-form/RHFRadio";
import RadioItem from "./hook-form/RadioItem";
import useGet from "../hooks/useGet";
import MySelectList from "./MySelectList";
import DialogManyInputText from "./dialog/DialogManyInputText";
import usePost from "../hooks/usePost";
import usePut from "../hooks/usePut";
import {getDiff, toFormData} from "../utils/object";
import useSnack from "../hooks/useSnack";
import useDelete from "../hooks/useDelete";
import {toServerPath} from "../utils/string";

const Item = ({item}) => <>{item.name} en {item.unity} ({item.unitySymbol})</>
Item.propTypes = {
	item: PropTypes.object.isRequired
}


export default function EquipmentForm({current = {}}) {
	const [file, setFile] = useState(null);
	const [error, setError] = useState(null);
	const [openTypeDialog, setOpenTypeDialog] = useState(false);
	const [errorType, setErrorType] = useState();
	const [typeEffect, setTypeEffect] = useState([]);
	const [active, setActive] = useState(current?.typeEffectId);
	const [typeUpdate, setTypeUpdate] = useState(null);
	const getMethod = useGet()
	const postMethod = usePost()
	const putMethod = usePut()
	const deleteMethod = useDelete()
	const snack = useSnack()
	
	const dv = useMemo(() => [
		{
			name: 'Name',
			default: current?.name || "",
			schema: Yup.string().required("Ce champs est obligatoire !"),
			isForm: true
		},
		{
			name: 'Description',
			default: current?.description || "",
			schema: Yup.string().required("Ce champs est obligatoire !"),
			isForm: true,
			isTextArea: true
		},
		{
			name: 'IsConstraint',
			default: current?.isConstraint || "false" ,
			schema: Yup.string().required("Ce champs est obligatoire !")
		},
	], [current]);
	const typeField = useMemo(() => {
		const {name = "", unity = "", unitySymbol = ''} = typeUpdate || {}
		return [
			{
				name: 'name',
				label: 'Nom',
				default: name,
				schema: Yup.string().required("Ce champs est obligatoire !"),
				isForm: true
			},
			{
				name: 'unity',
				label: 'Unite',
				default: unity,
				schema: Yup.string().required("Ce champs est obligatoire !"),
				isForm: true
			},
			{
				name: 'unitySymbol',
				label: 'Symbole',
				default: unitySymbol,
				schema: Yup.string().required("Ce champs est obligatoire !"),
				isForm: true
			}
		]
	}, [typeUpdate])
	
	const init = useCallback(async () => {
		const data = await getMethod("TypeEffect")
		setTypeEffect(data.map(item => ({...item, content: <Item item={item}/>})))
		return data
	}, [getMethod]);
	
	useEffect(() => {
		init().then(console.log)
	}, [init]);
	
	const handleSubmit = useCallback(async (e) => {
		if (!file || !active) return
		const equipment = {...e, File: file, TypeEffectId: active}
		const data = toFormData(equipment)
		const re = await postMethod("Equipment", "Enregistrement effectuee avec success !", {data})
		console.log(re)
	}, [active, file, postMethod]);
	
	const handleVerify = useCallback(() => {
		if (!file) setError("Fichier obligatoire")
		if (!active) setErrorType("Type d'effet obligatoire")
	}, [active, file]);
	
	const handleCloseDialogType = useCallback(() => {
		setTypeUpdate(null)
		setOpenTypeDialog(false)
	}, []);
	const handleSubmitType = useCallback(async (data) => {
		let dt
		if (!typeUpdate) {
			dt = await postMethod("TypeEffect", "Type d'effet enregistre avec success", {data})
		} else {
			const diff = getDiff(data, typeUpdate)
			if (Object.entries(diff).length) {
				dt = await putMethod(`TypeEffect`, "Type d'effet modifie avec success", {data: {...diff, id: typeUpdate.id}})
			} else {
				snack("Aucune modification effectuee !", {variant: "warning"})
				return
			}
		}
		setTypeUpdate(null)
		if (dt) await init()
		if (dt) setOpenTypeDialog(false)
	}, [init, postMethod, putMethod, snack, typeUpdate]);
	
	const handleDeleteType = useCallback(async (id) => {
		await deleteMethod(`TypeEffect/${id}`, "Suprression effectuee avec success !")
		await init()
	}, [deleteMethod, init]);
	
	const handleOpenDialogUpdate = useCallback(
		(id) => {
			const {name, unity, unitySymbol} = typeEffect.find(i => i.id === id)
			setTypeUpdate({name, unity, unitySymbol, id})
			setOpenTypeDialog(true)
		},
		[typeEffect],
	);
	
	
	return <>
		<Grid container spacing={2}>
			<Grid item xs={5}>
				<MyCard>
					<FileDisplay3D defaultFile={current ? toServerPath(current?.file): ""} onSetFile={setFile} error={error} onSetError={setError}/>
				</MyCard>
			</Grid>
			<Grid item xs={7} alignSelf="end">
				<MyCard>
					<FormGenerator fields={dv} onSubmit={handleSubmit} onVerify={handleVerify} btnText="Enregistrer">
						<RHFTextField name="Name" label="Nom de l'equipemment"/>
						<RHFTextField multiline name="Description" label="Nom de l'equipemment"/>
						<FormControl>
							<FormLabel>Type d'equipement</FormLabel>
							<RHFRadio
								name="IsConstraint"
							>
								<RadioItem value="true" label="Contrainte avant la reaction"/>
								<RadioItem value="false" label="Materiel pour reaction"/>
							</RHFRadio>
						</FormControl>
						<FormControl>
							<FormLabel>Type d'effet produit par l'equipement</FormLabel>
							<MySelectList
								items={typeEffect}
								active={active}
								onSelected={setActive}
								onResetError={setErrorType}
								errorMsg={errorType}
								onOpenAdd={() => setOpenTypeDialog(true)}
								onOpenDialog={handleOpenDialogUpdate}
								onDeleteOne={handleDeleteType}
								deleteAlertTitle="Suppression d'un type d'effet ?"
								deleteAlertContent="Sa suppression entrainera celle de tous les elements en rapprot ?"
							/>
						</FormControl>
					</FormGenerator>
				</MyCard>
			</Grid>
		</Grid>
		{
			openTypeDialog &&
			<DialogManyInputText
				title="Ajout d'un type d'effet"
				description="Rensegnez les informatons sur le type d'effet dans les champs ci-dessous"
				onClose={handleCloseDialogType}
				onSubmit={handleSubmitType}
				fields={typeField}
				open={openTypeDialog}
			/>
		}
	</>
}

EquipmentForm.propTypes = {
	current: PropTypes.object
};