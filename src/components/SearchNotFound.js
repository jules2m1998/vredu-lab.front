import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Vide
      </Typography>
      <Typography variant="body2" align="center">
        Aucun resultat trouve
        <strong>&quot;{searchQuery}&quot;</strong>. Essayez avec tous le nom
      </Typography>
    </Paper>
  );
}
