import {styled} from "@mui/material/styles";
import {ClimbingBoxLoader} from "react-spinners";
import {Typography} from "@mui/material";
import palette from "../theme/palette";

const ContentStyle = styled('div')(({theme}) => ({
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));


export default () => <ContentStyle><Typography color="primary">Chargement...</Typography><ClimbingBoxLoader color={palette.primary.lighter} /></ContentStyle>