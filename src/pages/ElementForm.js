import {
	Box,
	Card,
	Container,
	FormControl,
	FormLabel,
	Grid,
	Stack,
	Tab,
	Tabs,
	Typography
} from "@mui/material";
import * as Yup from "yup";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoadingButton} from "@mui/lab";
import {useSearchParams} from "react-router-dom";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import TabPanel from "../components/tab/TabPanel";
import {FormProvider, RHFTextField} from "../components/hook-form";
import {tryParseInt} from "../utils/string";
import ImgFileDrag from "../components/ImgFileDrag";
import MySelectList from "../components/MySelectList";
import {DialogOneInput} from "../components/dialog/DialogOneInput";
import usePost from "../hooks/usePost";
import useGet from "../hooks/useGet";
import useDelete from "../hooks/useDelete";
import usePut from "../hooks/usePut";
import TextureSelect from "../components/TextureSelect";
import {getDiff, paramsStringToNumber, toFormData, toUpper} from "../utils/object";
import Loader from "../components/Loaders/Loader";
import useSnack from "../hooks/useSnack";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const REQUIRED = 'Ce champs est obligatoire !'

function AtomForm({atom = null}) {
	const [openCreateGroup, setOpenCreateGroup] = useState(false);
	const [groups, setGroups] = useState([]);
	
	const [openCreateType, setOpenCreateType] = useState(false);
	const [types, setTypes] = useState([]);
	
	const [textures, setTextures] = useState([]);
	
	const [type, setType] = useState(atom?.type?.id);
	const [group, setGroup] = useState(atom?.group?.id);
	const [image, setImage] = useState(null);
	const [texture, setTexture] = useState(atom?.texture?.id);
	
	const [typeError, setTypeError] = useState(null);
	const [groupError, setGroupError] = useState(null);
	const [textureError, setTextureError] = useState(null);
	
	const postMethod = usePost()
	const getMethod = useGet()
	const deleteMethod = useDelete()
	const putMethod = usePut()
	const snack = useSnack()
	
	const atomSchema = Yup.object().shape({
		Name: Yup.string().required(REQUIRED),
		Symbol: Yup.string().required(REQUIRED),
		MassNumber: Yup.string().test(
			'isNumber',
			'Ce champs est requis et doit etre un nombre',
			(value) => tryParseInt(value) > 0
		),
		AtomicNumber: Yup.string().test(
			'isNumber2',
			'Ce champs est requis et doit etre un nombre',
			(value) => tryParseInt(value) > 0
		),
	})
	
	const defaultValues = useMemo(() => ({
		Name: atom?.name || "",
		Symbol: atom?.symbol || "",
		MassNumber: atom?.massNumber || "",
		AtomicNumber: atom?.atomicNumber || "",
	}), [atom]);
	
	const methods = useForm({
		resolver: yupResolver(atomSchema),
		defaultValues,
	});
	
	const {
		handleSubmit,
		formState: {isSubmitting},
	} = useMemo(() => methods, [methods]);
	
	const onSubmit = useCallback(async (e) => {
		if (type === null || group === null || texture === null) return
		const payload = {...e, GroupId: group, TypeId: type, TextureId: texture, Image: image}
		if (!atom) {
			const data = toFormData(payload)
			const result = await postMethod("Element", "Element cree avec succes", {data})
			console.log(result)
		} else {
			const diff = getDiff(paramsStringToNumber(payload), toUpper({...atom, TypeId: atom?.type?.id, GroupId: atom?.group?.id, TextureId: atom?.texture?.id, }))
			if (diff.Image === null) delete diff.Image
			if (!Object.entries(diff).length){
				snack("Aucune modification apportee a l'element !", {variant: "warning"})
			} else {
				diff.Id = atom?.id
				const result = await putMethod('Element', "Modification effectuee !", {data: toFormData(diff)})
				console.log(result)
			}
		}
	}, [atom, group, image, postMethod, putMethod, snack, texture, type]);
	const getGroup = useCallback(async () => {
		const data = await getMethod("GroupElement")
		if (data) setGroups(data);
	}, [getMethod]);
	const getType = useCallback(async () => {
		const data = await getMethod("TypeElement")
		if (data) setTypes(data);
	}, [getMethod]);
	const getTextures = useCallback(async () => {
		const data = await getMethod("Texture")
		if (data) setTextures(data)
	}, [getMethod]);
	const handleCreateGroup = useCallback(async (e) => {
		const data = await postMethod(`GroupElement/${e.name}`, "Groupe d'element cree", {data: null})
		if (data) {
			await getGroup()
			setOpenCreateGroup(false)
		}
	}, [getGroup, postMethod]);
	const handleCreateType = useCallback(async (e) => {
		const data = await postMethod(`TypeElement/${e.name}`, "Groupe d'element cree", {data: null})
		if (data) {
			await getType()
			setOpenCreateType(false)
		}
	}, [getType, postMethod]);
	const handleDeleteOneGroup = useCallback(async (id) => {
		await deleteMethod(`GroupElement/${id}`, "Suppression effectuee")
		await getGroup()
	}, [deleteMethod, getGroup]);
	const handleDeleteOneType = useCallback(async (id) => {
		await deleteMethod(`TypeElement/${id}`, "Suppression effectuee")
		await getType()
	}, [deleteMethod, getType]);
	const handleUpdateOneGroup = useCallback(async (id, value) => {
		const data = await putMethod("GroupElement", "Modification reussie", {data: {name: value.name, id}})
		await getGroup()
		return !!data
	}, [getGroup, putMethod]);
	const handleUpdateOneType = useCallback(async (id, value) => {
		const data = await putMethod("TypeElement", "Modification reussie", {data: {name: value.name, id}})
		await getType()
		return !!data
	}, [getType, putMethod]);
	const verify = useCallback(() => {
		if (type === null) {
			setTypeError(REQUIRED)
		}
		if (group === null) {
			setGroupError(REQUIRED)
		}
		if (texture === null) {
			setTextureError(REQUIRED)
		}
	}, [group, texture, type]);
	
	useEffect(() => {
		getGroup()
		getType()
		getTextures()
	}, [getGroup, getTextures, getType]);
	
	return <>
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<ImgFileDrag
						disabled={isSubmitting}
						loading={isSubmitting}
						onChange={setImage}
						onResetErrorMsg={() => null}
						defaultImage={atom?.image}
					/>
				</Grid>
				<Grid container item xs={9} spacing={3}>
					<Grid item container xs={12} spacing={2}>
						<Grid item xs={8}>
							<RHFTextField name="Name" label="Nom de l'atome"/>
						</Grid>
						<Grid item xs={4}>
							<RHFTextField name="Symbol" label="Symbole de l'atome"/>
						</Grid>
					</Grid>
					<Grid item container xs={12} spacing={2}>
						<Grid item xs={6}>
							<RHFTextField name="MassNumber" label="Nombre de masse"/>
						</Grid>
						<Grid item xs={6}>
							<RHFTextField name="AtomicNumber" label="Numero atomique"/>
						</Grid>
					</Grid>
					<Grid item container xs={12} spacing={2}>
						<Grid item xs={6}>
							<FormControl>
								<FormLabel sx={{mb: 1}}>Groupe d'element</FormLabel>
								<MySelectList
									items={groups}
									onOpenAdd={() => setOpenCreateGroup(true)}
									onDeleteOne={handleDeleteOneGroup}
									deleteAlertTitle="Suppression d'un groupe d'element !"
									deleteAlertContent="La suppression de ce groupe d'element entraine celle des elements chimique et pourrait alterer certaines reactions"
									align="start"
									onOneEdit={handleUpdateOneGroup}
									active={group}
									onSelected={setGroup}
									onResetError={() => setGroupError(null)}
									errorMsg={groupError}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl>
								<FormLabel sx={{mb: 1}}>Type d'element</FormLabel>
								<MySelectList
									items={types}
									align="start"
									onOpenAdd={() => setOpenCreateType(true)}
									deleteAlertTitle="Suppression d'un type d'element !"
									deleteAlertContent="La suppression de ce type d'element entraine celle des elements chimique et pourrait alterer certaines reactions"
									onOneEdit={handleUpdateOneType}
									onDeleteOne={handleDeleteOneType}
									active={type}
									onSelected={setType}
									onResetError={() => setTypeError(null)}
									errorMsg={typeError}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<FormLabel sx={{mb: 1}}>Texture</FormLabel>
								<TextureSelect
									active={texture}
									onChange={setTexture}
									textures={textures}
									errorMsg={textureError}
									onResetError={() => setTextureError(null)}
								/>
							</FormControl>
						</Grid>
					</Grid>
					<Grid item alignItems="end">
						<LoadingButton
							size="large"
							type="submit"
							variant="contained"
							loading={isSubmitting}
							onClick={verify}
						>
							{
								atom ? "Modifier" : "Enregistrer"
							}
						</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</FormProvider>
		{
			openCreateGroup &&
			<DialogOneInput
				open={openCreateGroup}
				title="Ajouter un group d'element"
				description="Rensegnez les informatons sur le groupe d'element dans le champs ci-dessous"
				label="Nom du groupe"
				onSubmit={handleCreateGroup}
				onClose={() => setOpenCreateGroup(false)}
			/>
		}
		{
			openCreateType &&
			<DialogOneInput
				open={openCreateType}
				title="Ajouter un type d'element"
				description="Rensegnez les informatons sur le type d'element dans le champs ci-dessous"
				label="Nom du type"
				onSubmit={handleCreateType}
				onClose={() => setOpenCreateType(false)}
			/>
		}
	</>
}

AtomForm.propTypes = {
	atom: PropTypes.object
}

export default function ElementForm() {
	const [value, setValue] = useState(0);
	const [element, setElement] = useState(null);
	const [loading, setLoading] = useState(true);
	
	const isAtom = useCallback(() => {
		if (element) return element.children.length === 0
		return null
	}, [element]);
	
	const tabHeaders = useMemo(() => [
		{name: "Atome", icon: "bx:atom", disabled: isAtom() === false},
		{name: "Molecule", icon: "file-icons:moleculer", disabled: isAtom()},
	], [isAtom])
	const [searchParams] = useSearchParams();
	const getMethod = useGet()
	
	const getCurrentElement = useCallback(async (id) => {
		const element = await getMethod(`Element/${id}`)
		if (element) {
			setElement(element)
			setValue(element.children.length !== 0 ? 1 : 0)
		}
		setLoading(false)
	}, [getMethod]);
	
	useEffect(() => {
		const id = searchParams.get("id")
		if (id) getCurrentElement(id)
		else setLoading(false)
	}, [getCurrentElement, searchParams]);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	
	if (loading) return <Loader text="Chargement de l'element..."/>
	
	return <Page title="Creation d'elements chimiques">
		<Container>
			<Stack>
				<Typography variant="h4" sx={{}}>
					Creation d'une molecule ou d'un atomme
				</Typography>
				<Typography sx={{color: 'text.secondary', mb: 5}}>
					Saisissez les informations sur l'equpement
					a creer ci-dessous !
				</Typography>
			</Stack>
			<Stack direction="row" flexWrap="wrap-reverse" alignItems="center" sx={{mb: 5}}>
				<Box sx={{width: "100%"}}>
					<Box>
						<Tabs value={value} onChange={handleChange}>
							{
								tabHeaders.map((item, k) => (
									<Tab
										sx={{
											paddingBottom: 0,
											textTransform: "none"
										}}
										disableRipple
										icon={<Iconify icon={item.icon} sx={{width: 18, height: 18}}/>}
										iconPosition="start"
										label={item.name}
										{...a11yProps(k)}
										disabled={item.disabled}
										key={k}
									/>
								))
							}
						</Tabs>
					</Box>
					<Card sx={{p: 3}}>
						<TabPanel value={value} index={0}>
							<AtomForm atom={isAtom() === true ? element : null}/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							2
						</TabPanel>
					</Card>
				</Box>
			</Stack>
		</Container>
	</Page>
}