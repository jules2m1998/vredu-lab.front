import {styled, keyframes} from "@mui/material/styles";

export const pulseAnimation = keyframes(
	{
		from: {
			boxShadow: `0px 0px 0 0px rgb(255, 0, 0, 1)`
		},
		to: {
			boxShadow: `0px 0px 25px 0 rgb(255, 0, 0, 0)`
		}
	}
)

export const RootStyle = styled('div')(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex',
	},
}));


export const HeaderStyle = styled('header')(({theme}) => ({
	top: 0,
	zIndex: 9,
	lineHeight: 0,
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	position: 'absolute',
	padding: theme.spacing(3),
	justifyContent: 'space-between',
	[theme.breakpoints.up('md')]: {
		alignItems: 'flex-start',
		padding: theme.spacing(7, 5, 0, 7),
	},
}));

export const ContentStyle = styled('div')(() => ({
	maxWidth: 480,
	margin: 'auto',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
}));