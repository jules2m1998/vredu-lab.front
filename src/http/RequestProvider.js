import React, {useMemo} from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import Fetch from "./request";
import {logout} from "../store/user";


export const RequestContext = React.createContext(null);

const RequestProvider = ({children}) => {
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()

    const value = useMemo(() => new Fetch(enqueueSnackbar, () => dispatch(logout())), [dispatch, enqueueSnackbar])

    return <RequestContext.Provider value={value}>
        {children}
    </RequestContext.Provider>
}


RequestProvider.propTypes = {
    children: PropTypes.node
};

export default RequestProvider