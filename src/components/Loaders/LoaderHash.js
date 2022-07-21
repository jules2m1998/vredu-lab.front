import {Typography} from "@mui/material";
import {HashLoader} from "react-spinners";
import PropTypes from "prop-types";
import palette from "../../theme/palette";
import {ContentStyleLoad} from "../../style";

export default function LoaderHash ({text}) {
    return <ContentStyleLoad>
        <HashLoader color={palette.primary.lighter} />
        <Typography color="primary" sx={{paddingTop: 2}}>{text}</Typography>
    </ContentStyleLoad>
}

LoaderHash.propTypes = {
    text: PropTypes.string
};