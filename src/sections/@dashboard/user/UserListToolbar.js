import PropTypes from 'prop-types';
import {useCallback} from "react";
// material
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Box} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
	height: 96,
	display: 'flex',
	justifyContent: 'space-between',
	padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
	width: 240,
	transition: theme.transitions.create(['box-shadow', 'width'], {
		easing: theme.transitions.easing.easeInOut,
		duration: theme.transitions.duration.shorter,
	}),
	'&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
	'& fieldset': {
		borderWidth: `1px !important`,
		borderColor: `${theme.palette.grey[500_32]} !important`,
	},
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
	numSelected: PropTypes.number,
	filterName: PropTypes.string,
	isLoading: PropTypes.bool,
	onFilterName: PropTypes.func,
	onSetMultiple: PropTypes.func,
	placeholder: PropTypes.string
};

export default function UserListToolbar({numSelected, isLoading, filterName, onFilterName, placeholder, onSetMultiple}) {
	const activate = useCallback(() => {onSetMultiple(false)}, [onSetMultiple])
	const deactivate = useCallback(() => {onSetMultiple(true)}, [onSetMultiple])
	
	return (
		<RootStyle
			sx={{
				...(numSelected > 0 && {
					color: 'primary.main',
					bgcolor: 'primary.lighter',
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography component="div" variant="subtitle1">
					{numSelected} Selectionnes
				</Typography>
			) : (
				<SearchStyle
					value={filterName}
					onChange={onFilterName}
					placeholder={placeholder}
					disabled={isLoading}
					startAdornment={
						<InputAdornment position="start">
							<Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
						</InputAdornment>
					}
				/>
			)}
			
			{numSelected > 0 ? (
				<>
					<Box>
						<Tooltip title="Delete" sx={{color: "text.accent"}} onClick={deactivate}>
							<IconButton disabled={isLoading}>
								<Iconify icon="eva:close-outline"/>
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete" sx={{color: "success.main"}} onClick={activate}>
							<IconButton disabled={isLoading}>
								<Iconify icon="eva:checkmark-outline"/>
							</IconButton>
						</Tooltip>
					</Box>
				</>
			) : (
				<Tooltip title="Filter list">
					<IconButton disabled={isLoading}>
						<Iconify icon="ic:round-filter-list"/>
					</IconButton>
				</Tooltip>
			)}
		</RootStyle>
	);
}
