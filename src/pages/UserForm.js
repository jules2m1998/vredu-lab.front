import {Container, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Page from "../components/Page";
import {RegisterForm} from "../sections/auth/register";
import {ContentStyle} from "../style";
import Loader from "../components/Loader";
import {get} from "../http/request";
import {logout} from "../store/user";

export default function UserForm() {
    const {id} = useParams()
    const [isLoading, changeLoading] = useState(false)
    const [current, changeCurrent] = useState({})
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            changeLoading(true)
            get(`/User/${id}`, {
                snack: enqueueSnackbar,
                handleUnauthorized: () => dispatch(logout())
            }).then(value => {
                if (!value) {
                    navigate('/dashboard/user/list', {replace: true});
                } else {
                    changeCurrent(value)
                    changeLoading(false)
                }
            })
        }
    }, [dispatch, enqueueSnackbar, id, navigate])

    return <Page title="Formulaire utilsateur">
        <Container>
            <ContentStyle>
                {!isLoading && <>
                    <Typography variant="h4" gutterBottom mb={5}>
                        {!id ?  "Enregistrez un nouvvel utilisateur" : "Modifier un utilisateur" }
                    </Typography>
                    <RegisterForm isAdmin user={
                        {...current, phone_number: current.phoneNumber, birthday: current.birthDate}
                    }/>
                </>}
                {isLoading && <Loader text="Chargement de l'utilisateur..."/>}
            </ContentStyle>
        </Container>
    </Page>
}