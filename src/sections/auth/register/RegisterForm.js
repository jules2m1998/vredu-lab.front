import * as Yup from 'yup';
import {useCallback, useEffect, useState} from 'react';
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
import {post} from "../../../http/request";
import {logout} from "../../../store/user";

// ----------------------------------------------------------------------

RegisterForm.propTypes = {
    isAdmin: PropTypes.bool,
    user: PropTypes.object
};

function formatDate(date) {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2)
        month = `0${month}`;
    if (day.length < 2)
        day = `0${day}`;

    return [year, month, day].join('-');
}

const defaultUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthday: "",
    username: "",
    phone_number: "",
    sex: 0,
}

export default function RegisterForm({isAdmin = false, user = defaultUser}) {
    const {firstName, lastName, email, password, birthday, username, sex} = user
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const {enqueueSnackbar} = useSnackbar()

    const [defaultValues] = useState({
        firstName,
        lastName,
        email,
        password,
        birthday: formatDate(birthday),
        username,
        "phone_number": user.phone_number,
        sex
    });

    const isIdentity = useCallback(() => JSON.stringify(defaultValues) === JSON.stringify(defaultUser), [defaultValues])

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('Le prenom est obligatoire'),
        username: Yup.string().required('Le prenom est obligatoire'),
        lastName: Yup.string().required('Le nom est obligatoire'),
        email: Yup.string().email('L\'adresse email doit etre valide !').required('\'adresse email est obligatoire'),
        phone_number: Yup.string().required('Numero de telephone obligatoire !'),
        sex: Yup.string().required('Le mot de passe est obligatoire'),
        birthday: Yup.string().required('Le mot de passe est obligatoire'),
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
            formData.append("lastname", e.lastName)
            formData.append("sex", e.sex)
            formData.append("birthDate", e.birthday)
            formData.append("username", e.username)
            formData.append("phoneNumber", e.phone_number)
            formData.append("firstname", e.firstName)
            formData.append("password", e.password)
            formData.append("email", e.email)

            const data = await post("/Auth/register", {
                form: formData,
                snack: enqueueSnackbar,
                msg: "Compte cree avec success !",
                handleUnauthorized: () => dispatch(logout())
            })
            if (data) {
                if (!isAdmin) {
                    dispatch(logout())
                    navigate('/login', {replace: true});
                    methods.reset()
                }
            }
        } else {
            const oldUser = Object.keys(e).reduce((previousValue, currentValue) => {
                if(defaultValues[currentValue] !== e[currentValue]) return {
                    ...previousValue,
                    [currentValue]: e[currentValue]
                }
                return {...previousValue}
            }, {})
            console.log(oldUser)
        }
    }, [defaultValues, dispatch, enqueueSnackbar, isAdmin, isIdentity, methods, navigate])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <RHFTextField name="firstName" label="First name"/>
                    <RHFTextField name="lastName" label="Last name"/>
                </Stack>

                <RHFTextField name="username" label="Nom d'utilisateur"/>
                <RHFTextField name="email" label="Adresse email"/>
                <RHFTextField name="phone_number" label="Numero de telephone"/>
                <RHFTextField
                    name="birthday"
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
