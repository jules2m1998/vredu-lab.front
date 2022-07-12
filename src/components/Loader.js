import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import {ClimbingBoxLoader} from "react-spinners";
import {Typography} from "@mui/material";
import palette from "../theme/palette";

const ContentStyle = styled('div')(({theme}) => ({
    margin: 'auto',
    minWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));

Loader.propTypes = {
  text: PropTypes.string,
};


export default function Loader ({text}) {
    return <ContentStyle><ClimbingBoxLoader color={palette.primary.lighter} /><Typography color="primary">{text}</Typography></ContentStyle>
}