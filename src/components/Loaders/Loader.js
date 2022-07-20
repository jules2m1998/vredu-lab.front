import PropTypes from "prop-types";
import {ClimbingBoxLoader} from "react-spinners";
import {Typography} from "@mui/material";
import {ContentStyleLoad} from "../../style";
import palette from "../../theme/palette";

Loader.propTypes = {
  text: PropTypes.string,
};


export default function Loader ({text}) {
    return <ContentStyleLoad><ClimbingBoxLoader color={palette.primary.lighter} /><Typography color="primary">{text}</Typography></ContentStyleLoad>
}