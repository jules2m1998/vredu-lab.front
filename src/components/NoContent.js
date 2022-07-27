import {Box, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {ContentStyle} from "../style";

export default function NoContent ({ title = "Aucun element trouve !", description = "Veillez en creer une !"}){
	return <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            {title}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>

          <Box
            component="img"
            src="/static/illustrations/noData.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
        </ContentStyle>
}

NoContent.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
}