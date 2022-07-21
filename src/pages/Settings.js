import {
	Box,
	Container,
	Stack,
	Tabs,
	Tab,
	Typography,
	MenuItem,
	InputAdornment,
	IconButton,
	Card,
	Grid
} from "@mui/material";
import PropTypes from "prop-types";
import {useCallback, useContext, useMemo, useState} from "react";
import {LoadingButton} from "@mui/lab";
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {yupResolver} from "@hookform/resolvers/yup";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import {FormProvider, RHFTextField} from "../components/hook-form";
import {RHFSelect} from "../components/hook-form/RHFSelect";
import {connectedUser, updateUser} from "../store/user";
import {getDiff, toFormData} from "../utils/object";
import {RequestContext} from "../http/RequestProvider";
import ImgFileDrag from "../components/ImgFileDrag";
import usePut from "../hooks/usePut";

function TabPanel(props) {
	const {children, value, index, ...other} = props;
	
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{pt: 3}}>{children}</Box>
			)}
		</div>
	);
}

function GeneralForm() {
	const [file, setFile] = useState(null);
	const dispatch = useDispatch()
	const {enqueueSnackbar} = useSnackbar()
	const [errorMsg, setErrorMsg] = useState(null);
	
	const putMethod = usePut()
	
	const user = useSelector(connectedUser)
	
	const defaultValues = useMemo(() => (user), [user])
	
	const SettingGeneral = Yup.object().shape({
		email: Yup.string().email('L\'adresse email doit etre valide !')
	});
	
	const methods = useForm({
		resolver: yupResolver(SettingGeneral),
		defaultValues
	})
	
	const {
		handleSubmit,
		formState: {isSubmitting},
	} = methods
	
	const onSubmit = useCallback(async (e) => {
		const diff = getDiff(e, defaultValues, true)
		if (file) diff.Image = file
		
		if (Object.keys(diff).length > 0) {
			const formData = toFormData(diff)
			const data = await putMethod("/User", "Information modifies avec succes !", {data: formData})
			if (data) {
				dispatch(updateUser(data))
			}
		} else {
			enqueueSnackbar("Aucune information modifiee !", {variant: "warning"})
		}
	}, [defaultValues, dispatch, enqueueSnackbar, file, putMethod])
	
	return <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
		<Typography variant="h5" sx={{mb: 1}}>
			Modifiez vos information
		</Typography>
		<Typography sx={{color: 'text.secondary', mb: 5}}>
			Saisissez vos informattions personnelles ci-dessous
		</Typography>
		
		<Grid container spacing={2}>
			<Grid item xs={3}>
				<ImgFileDrag
					disabled={isSubmitting}
					loading={isSubmitting}
					onChange={setFile}
					defaultImage={user?.image}
					errorMsg={errorMsg}
					onResetErrorMsg={() =>  setErrorMsg(null)}
				/>
			</Grid>
			<Grid item xs={9}>
				<Stack spacing={3}>
					
					<Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
						<RHFTextField disabled={isSubmitting} name="firstName" label="First name"/>
						<RHFTextField disabled={isSubmitting} name="lastName" label="Last name"/>
					</Stack>
					<Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
						<RHFTextField disabled={isSubmitting} name="userName" label="Nom d'utilisateur"/>
						<RHFTextField disabled={isSubmitting} name="email" label="Adresse email"/>
					</Stack>
					<Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
						<RHFTextField disabled={isSubmitting} name="phoneNumber" label="Numero de telephone"/>
						<RHFTextField
							disabled={isSubmitting}
							name="birthDate"
							id="date"
							label="Date de naissance"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Stack>
					<RHFSelect disabled={isSubmitting} name="sex" label="Sexe">
						<MenuItem selected>Selectionner</MenuItem>
						<MenuItem selected value={0}>Masculin</MenuItem>
						<MenuItem value={1}>Feminin</MenuItem>
					</RHFSelect>
					<Stack alignItems="end">
						
						<LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
							Enregistrer
						</LoadingButton>
					</Stack>
				</Stack>
			</Grid>
		</Grid>
	</FormProvider>
}

function PasswordForm() {
	const [isOldShow, setOldShow] = useState(false)
	const [isNewShow, setNewShow] = useState(false)
	const request = useContext(RequestContext)
	
	const defaultValues = useMemo(() => ({
		OldPassword: "",
		NewPassword: ""
	}), [])
	
	const RegisterSchema = Yup.object().shape({
		OldPassword: Yup.string().required('Ancien mot de passe obligatoire !'),
		NewPassword: Yup.string().required('Nouveau mot de passe obligatoire !'),
	});
	
	const methods = useForm({
		defaultValues,
		resolver: yupResolver(RegisterSchema)
	})
	
	const {handleSubmit, formState: {isSubmitting}} = useMemo(() => (methods), [methods])
	
	const onSubmit = useCallback(async (e) => {
		const formData = toFormData(e)
		await request.fetch("/User", {
			method: 'put',
			body: formData,
			successMsg: "Mot de passe modifie"
		})
	}, [request])
	
	return <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
		<Typography variant="h5" sx={{mb: 1}}>
			Modifiez votre mot de passe
		</Typography>
		<Typography sx={{color: 'text.secondary', mb: 5}}>Saisissez vos informattions personnelles
			ci-dessous </Typography>
		<Stack spacing={3}>
			<RHFTextField
				disabled={isSubmitting}
				name="OldPassword"
				label="Ancien mot de passe"
				type={isOldShow ? 'text' : 'password'}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton edge="end" onClick={() => setOldShow(!isOldShow)}>
								<Iconify icon={isOldShow ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<RHFTextField
				disabled={isSubmitting}
				name="NewPassword"
				label="Nouveau mot de passe"
				type={isNewShow ? 'text' : 'password'}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton edge="end" onClick={() => setNewShow(!isNewShow)}>
								<Iconify icon={isNewShow ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			
			<Stack alignItems="end">
				
				<LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
					Enregistrer
				</LoadingButton>
			</Stack>
		</Stack>
	</FormProvider>
}

TabPanel.propTypes = {
	children: PropTypes.node.isRequired,
	value: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function Settings() {
	const [value, setValue] = useState(0);
	
	const tabHeaders = useMemo(() => [
		{name: "General", icon: "bxs:user-rectangle"},
		{name: "Mot de passe", icon: "bx:key"},
	], [])
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return <div>
		<Page title="Setting : user">
			<Container>
				<Typography variant="h4" sx={{mb: 5}}>
					Informations personnel
				</Typography>
				
				<Stack direction="row" flexWrap="wrap-reverse" alignItems="center" sx={{mb: 5}}>
					<Box sx={{width: "100%"}}>
						<Box>
							<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
								{tabHeaders.map((item, k) => (
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
										key={k}
									/>
								))}
							</Tabs>
						</Box>
						<Card sx={{p: 3}}>
							<TabPanel value={value} index={0}>
								<GeneralForm/>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<PasswordForm/>
							</TabPanel>
						</Card>
					</Box>
				</Stack>
			</Container>
		</Page>
	</div>
}