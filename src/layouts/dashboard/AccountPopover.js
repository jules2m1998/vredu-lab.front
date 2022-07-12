import {useCallback, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
// @mui
import {alpha} from '@mui/material/styles';
import {Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, ListItemIcon} from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import {connectedUser, logout} from "../../store/user";
import palette from "../../theme/palette";
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------
const MENU_OPTIONS = [
    {
        label: 'Home',
        icon: 'eva:home-fill',
        linkTo: '/',
    },
    {
        label: 'Profile',
        icon: 'eva:person-fill',
        linkTo: '#',
    },
    {
        label: 'Settings',
        icon: 'eva:settings-2-fill',
        linkTo: '#',
    },
];
// ----------------------------------------------------------------------

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector(connectedUser)

    const [open, setOpen] = useState(null);

    const disconnect = useCallback(() => {
        dispatch(logout())
        setOpen(null);
    }, [dispatch])

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={user.image || account.photoURL} alt="photoURL"/>
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.firstName} {user?.lastName?.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {user.email}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack sx={{p: 1}}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem onClick={disconnect} sx={{m: 1, color: palette.error.light}} >
                    <ListItemIcon sx={{color: palette.error.light}}>
                        <Iconify icon="eva:log-in-outline" width={22} height={22} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </MenuPopover>
        </>
    );
}
