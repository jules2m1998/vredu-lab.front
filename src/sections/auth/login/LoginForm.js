import * as Yup from 'yup';
import {useCallback, useState} from 'react';
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Link, Stack, IconButton, InputAdornment} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField, RHFCheckbox} from '../../../components/hook-form';
import {get, post} from "../../../http/request";
import {login, loadUser} from "../../../store/user";

// ----------------------------------------------------------------------

export default function LoginForm() {

    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);

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

        const errorMsg = [
            {
                status: 401,
                msg: "Nom d'utilisateur ou mot de passe errone veillez verifier vos informations"
            }
        ]

        const data = await post("/Auth/login", formData, enqueueSnackbar, errorMsg, "Bienvenu !")
        if (data) {
            dispatch(login(data.token))
            const user = await get("/Auth/user")
            if (user) {
                dispatch(loadUser(user))
                navigate('/dashboard', {replace: true});
            }
        }

    }, [dispatch, enqueueSnackbar, navigate])

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
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <RHFCheckbox name="remember" label="Remember me"/>
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Login
            </LoadingButton>
        </FormProvider>
    );
}
