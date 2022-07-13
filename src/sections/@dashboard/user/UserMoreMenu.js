import {useCallback, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from "prop-types";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
    id: PropTypes.number,
    toggleState: PropTypes.func,
    isActivated: PropTypes.bool
}

export default function UserMoreMenu({id, isActivated, toggleState}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => {
      toggleState(id, isActivated)
      setIsOpen(false)
  }, [id, isActivated, toggleState])

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: isActivated ? 'text.accent' : 'success.main' }} onClick={toggle}>
          <ListItemIcon sx={{ color: isActivated ? 'text.accent' : 'success.main' }}>
            <Iconify icon={`eva:${isActivated ? "close-outline" : "checkmark-outline"}`} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={isActivated ? "Desactiver" : 'Activer'} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`/dashboard/user/form/${id}`} sx={{ color: 'text.secondary' }} >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Modifier" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
