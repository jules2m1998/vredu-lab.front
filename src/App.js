import {SnackbarProvider} from 'notistack'
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import {BaseOptionChartStyle} from './components/chart/BaseOptionChart';
import {isConnected, loadUser} from "./store/user";
import {get} from "./http/request";
import Loader from "./components/Loader";

// ----------------------------------------------------------------------

export default function App() {
    const connect = useSelector(isConnected);

    return (
        <ThemeProvider>
            <ScrollToTop/>
            <BaseOptionChartStyle/>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Router isLogIn={connect}/>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
