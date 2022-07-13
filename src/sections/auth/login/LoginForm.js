import * as Yup from 'yup';
import {useCallback, useContext, useState} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Stack, IconButton, InputAdornment} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import {login, loadUser} from "../../../store/user";
import {RequestContext} from "../../../http/RequestProvider";

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const request = useContext(RequestContext)

    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('Nom d\'utilisateur obligatoire !'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        username: '',
        password: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = useCallback(async (e) => {
        const formData = new FormData()
        formData.append("Username", e.username)
        formData.append("Password", e.password)

        const data = await request.fetch("/Auth/login", {
            method: 'post',
            body: formData,
            successMsg: "Bienvenu !"
        })

        if (data) {
            dispatch(login(data.token))
            const user = await request.fetch("/Auth/user")
            if (user) {
                dispatch(loadUser(user))
                navigate('/dashboard', {replace: true});
            }
        }

    }, [dispatch, navigate, request])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="username" label="Nom d'utilisateur"/>

                <RHFTextField
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Connexion
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
