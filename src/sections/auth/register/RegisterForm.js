import * as Yup from 'yup';
import {useCallback, useContext, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Stack, IconButton, InputAdornment, MenuItem} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import {RHFSelect} from "../../../components/hook-form/RHFSelect";
import {logout} from "../../../store/user";
import {RequestContext} from "../../../http/RequestProvider";

// ----------------------------------------------------------------------

RegisterForm.propTypes = {
    isAdmin: PropTypes.bool,
    user: PropTypes.object,
    id: PropTypes.number,
    handleUpdate: PropTypes.func
};

const defaultUser = {
    username: '',
    password: '',
    lastname: '',
    firstname: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    sex: 0
}

export default function RegisterForm({isAdmin = false, user = defaultUser, id, handleUpdate}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const request = useContext(RequestContext)

    const [showPassword, setShowPassword] = useState(false);
    const {enqueueSnackbar} = useSnackbar()

    const defaultValues = useMemo(() => user, [user]);

    const isIdentity = useCallback(() => JSON.stringify(defaultValues) === JSON.stringify(defaultUser), [defaultValues])

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('Le prenom est obligatoire'),
        userName: Yup.string().required('Le prenom est obligatoire'),
        lastName: Yup.string().required('Le nom est obligatoire'),
        email: Yup.string().email('L\'adresse email doit etre valide !').required('\'adresse email est obligatoire'),
        phoneNumber: Yup.string().required('Numero de telephone obligatoire !'),
        sex: Yup.string().required('Le mot de passe est obligatoire'),
        birthDate: Yup.string().required('Le mot de passe est obligatoire'),
        password: Yup.string().required('Le mot de passe est obligatoire'),
    });

    const RegisterSchemaUpdate = Yup.object().shape({
        email: Yup.string().email('L\'adresse email doit etre valide !')
    });

    const methods = useForm({
        resolver: yupResolver(isIdentity() ? RegisterSchema : RegisterSchemaUpdate),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = useCallback(async (e) => {
        const formData = new FormData()
        if (isIdentity()) {
            Object.entries(e).forEach(([k, v]) => formData.append(k,v))

            const data = await request.fetch("/Auth/register", {
                method: 'post',
                body: formData,
                successMsg: isAdmin ? "Utilsateur cree !" : 'votre compte a bien ete cree veillez vous connecter !'
            })

            if (data) {
                if (!isAdmin) {
                    dispatch(logout())
                    navigate('/login', {replace: true});
                    methods.reset()
                }
            }
        } else {
            const updated = Object.keys(e).reduce((previousValue, currentValue) => {
                const def = typeof defaultValues[currentValue] === 'string' ? defaultValues[currentValue].trim() : defaultValues[currentValue]
                const ef = typeof e[currentValue] === 'string' ? e[currentValue].trim() : e[currentValue]
                if(def !== ef) return {
                    ...previousValue,
                    [currentValue === 'password' ? "NewPassword" : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)]: ef
                }
                return {...previousValue}
            }, {})
            console.log(updated)
            if (!Object.keys(updated).length){
                enqueueSnackbar("Aucune information modifiee dans le formulaire !", {variant: 'warning'})
            } else {
                Object.entries(updated).forEach(([k, v]) => formData.append(k,v))
                formData.append("Id", id)
                const data = await request.fetch('/User/Admin', {
                    method: "put",
                    body: formData,
                    successMsg: 'utilisateur modifie avec succes !'
                })
                if (data){
                    handleUpdate(data)
                    navigate("/dashboard/user/list")
                }
            }
        }
    }, [defaultValues, dispatch, enqueueSnackbar, handleUpdate, id, isAdmin, isIdentity, methods, navigate, request])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <RHFTextField name="firstName" label="First name"/>
                    <RHFTextField name="lastName" label="Last name"/>
                </Stack>

                <RHFTextField name="userName" label="Nom d'utilisateur"/>
                <RHFTextField name="email" label="Adresse email"/>
                <RHFTextField name="phoneNumber" label="Numero de telephone"/>
                <RHFTextField
                    name="birthDate"
                    id="date"
                    label="Date de naissance"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <RHFTextField
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <RHFSelect name="sex" label="Sexe">
                    <MenuItem selected>Selectionner</MenuItem>
                    <MenuItem selected value={0}>Masculin</MenuItem>
                    <MenuItem value={1}>Feminin</MenuItem>
                </RHFSelect>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    {isAdmin ? "Enregistrer" : "Inscription"}
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
