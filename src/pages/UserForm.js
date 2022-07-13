import {Container, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Page from "../components/Page";
import {RegisterForm} from "../sections/auth/register";
import {ContentStyle} from "../style";
import Loader from "../components/Loader";
import {RequestContext} from "../http/RequestProvider";

export default function UserForm() {
    const {id} = useParams()
    const [isLoading, changeLoading] = useState(false)
    const [current, changeCurrent] = useState({})
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const request = useContext(RequestContext)

    const formatDate =  useCallback((date) => {
        const d = new Date(date);
        let month = `${d.getMonth() + 1}`;
        let day = `${d.getDate()}`;
        const year = d.getFullYear();

        if (month.length < 2)
            month = `0${month}`;
        if (day.length < 2)
            day = `0${day}`;

        return [year, month, day].join('-');
    }, [])

    useEffect(() => {
        if (id) {
            changeLoading(true)
            request.fetch(`/User/${id}`).then(value => {
                if (!value) {
                    navigate('/dashboard/user/list', {replace: true});
                } else {
                    changeCurrent(value)
                    changeLoading(false)
                }
            })
        }
    }, [dispatch, enqueueSnackbar, id, navigate, request])

    return <Page title="Formulaire utilsateur">
        <Container>
            <ContentStyle>
                {!isLoading && <>
                    <Typography variant="h4" gutterBottom mb={5}>
                        {!id ? "Enregistrez un nouvvel utilisateur" : "Modifier un utilisateur"}
                    </Typography>
                    {!id ? <RegisterForm isAdmin/> :
                        <RegisterForm
                            isAdmin
                            user={{...current, birthDate: formatDate(current.birthDate)}}
                            id={parseInt(id, 10)}
                            handleUpdate={changeCurrent}
                        />}
                </>}
                {isLoading && <Loader text="Chargement de l'utilisateur..."/>}
            </ContentStyle>
        </Container>
    </Page>
}