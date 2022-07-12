import * as Yup from 'yup';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Stack, IconButton, InputAdornment, MenuItem, Select, InputLabel, FormControl} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import {RHFSelect} from "../../../components/hook-form/RHFSelect";

// ----------------------------------------------------------------------

export default function RegisterForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

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

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = async (e) => {
        // navigate('/dashboard', {replace: true});
        console.log(e)
        const res
    };

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
                    defaultValue="2017-05-24"
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
                    Register
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
