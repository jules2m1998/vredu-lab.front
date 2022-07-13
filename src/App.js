import {SnackbarProvider} from 'notistack'
import { useSelector} from "react-redux";
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import {BaseOptionChartStyle} from './components/chart/BaseOptionChart';
import {isConnected} from "./store/user";
import RequestProvider from "./http/RequestProvider";

// ----------------------------------------------------------------------


export default function App() {
    const connect = useSelector(isConnected);

    return (
        <ThemeProvider>
            <ScrollToTop/>
            <BaseOptionChartStyle/>
            <SnackbarProvider
                maxSnack={10}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <RequestProvider>
                    <Router isLogIn={connect}/>
                </RequestProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
