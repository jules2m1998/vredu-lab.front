import {
	Box,
	Checkbox,
	IconButton,
	InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem,
	OutlinedInput,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Tooltip,
	Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {cloneElement, useCallback, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import {styled} from "@mui/material/styles";
import Iconify from "./Iconify";
import Loader from "./Loader";
import Scrollbar from "./Scrollbar";
import SearchNotFound from "./SearchNotFound";
import {applySortFilter, getComparator} from "../utils/object";
import {getLisItem} from "../utils/array";

const RootStyle = styled(Toolbar)(({theme}) => ({
	height: 96,
	display: 'flex',
	justifyContent: 'space-between',
	padding: theme.spacing(0, 1, 0, 3),
}));

export const MoreAction = ({menus}) => {
	
	const ref = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	
	const open = useCallback((e) => {
		e.stopPropagation()
		setIsOpen(true)
	}, [])
	const close = useCallback(() => {
		setIsOpen(false)
	}, [])
	const handleClick = useCallback((fn) => {
		close()
		fn()
	}, [close])
	
	return (
		<>
			<IconButton ref={ref} onClick={open}>
				<Iconify icon="eva:more-vertical-fill" width={20} height={20}/>
			</IconButton>
			<Menu
				open={isOpen}
				anchorEl={ref.current}
				onClick={(e) => e.stopPropagation()}
				onClose={close}
				PaperProps={{
					sx: {width: 200, maxWidth: '100%'},
				}}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
				transformOrigin={{vertical: 'top', horizontal: 'right'}}
			>
				{
					menus.map(({
						           title,
						           icon,
						           link,
						           color,
						           onClick
					           }, k) => {
						if (onClick) return (<MenuItem key={k} sx={{color: color || "text.primary"}} onClick={() => handleClick(onClick)}>
							<ListItemIcon sx={{color: color || "text.primary"}}>
								<Iconify icon={icon} width={24} height={24}/>
							</ListItemIcon>
							<ListItemText primary={title} primaryTypographyProps={{variant: 'body2'}}/>
						</MenuItem>)
						
						return (<MenuItem key={k} component={RouterLink} to={link} sx={{color: color || "text.primary"}}>
							<ListItemIcon>
								<Iconify sx={{color: color || "text.primary"}} icon={icon} width={24} height={24}/>
							</ListItemIcon>
							<ListItemText primary={title} primaryTypographyProps={{variant: 'body2'}}/>
						</MenuItem>)
					})
				}
			</Menu>
		</>
	)
}
MoreAction.propTypes = {
	menus: PropTypes.array
}


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


const visuallyHidden = {
	border: 0,
	margin: -1,
	padding: 0,
	width: '1px',
	height: '1px',
	overflow: 'hidden',
	position: 'absolute',
	whiteSpace: 'nowrap',
	clip: 'rect(0 0 0 0)',
};

const ListToolBar = (
	{
		numSelected,
		isLoading,
		filterName,
		onFilterName,
		placeholder,
		actionsButton
	}) =>
	<RootStyle sx={{
		...(numSelected > 0 && {
			color: 'primary.main',
			bgcolor: 'primary.lighter',
		}),
	}}>
		{
			numSelected > 0 ? (
					<Typography component="div" variant="subtitle1">
						{numSelected} Selectionnes
					</Typography>
				) :
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
		}
		{numSelected > 0 ? (
			<>
				<Box gap={2}>
					{actionsButton}
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

ListToolBar.propTypes = {
	numSelected: PropTypes.number,
	filterName: PropTypes.string,
	isLoading: PropTypes.bool,
	onFilterName: PropTypes.func,
	placeholder: PropTypes.string,
	actionsButton: PropTypes.node,
};

const ListHead = (
	{
		numSelected,
		rowCount,
		onSelectAllClick,
		headLabel,
		orderBy,
		order,
		onRequestSort,
		isSetLoading
	}) => {
	
	const createSortHandler = useCallback((property) => (event) => {
		onRequestSort(event, property);
	}, [onRequestSort]);
	
	return <TableHead>
		<TableRow>
			<TableCell padding="checkbox">
				<Checkbox
					indeterminate={numSelected > 0 && numSelected < rowCount}
					checked={rowCount > 0 && numSelected === rowCount}
					onChange={onSelectAllClick}
					disabled={isSetLoading}
				/>
			</TableCell>
			{
				headLabel.map(cell => (
					<TableCell
						key={cell.id}
						align={cell.alignRight ? "right" : "left"}
						sortDirection={orderBy === cell.id ? order : false}
					>
						<TableSortLabel
							hideSortIcon
							active={orderBy === cell.id}
							direction={orderBy === cell.id ? order : 'asc'}
							onClick={createSortHandler(cell.id)}
						>
							{cell.label}
							{
								orderBy === cell.id ? (
									<Box sx={{...visuallyHidden}}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null
							}
						</TableSortLabel>
					</TableCell>
				))
			}
		</TableRow>
	</TableHead>
}

ListHead.propTypes = {
	order: PropTypes.oneOf(['asc', 'desc']),
	orderBy: PropTypes.string,
	rowCount: PropTypes.number,
	headLabel: PropTypes.array,
	numSelected: PropTypes.number,
	isSetLoading: PropTypes.bool,
	onRequestSort: PropTypes.func,
	onSelectAllClick: PropTypes.func,
}

GenericTabs.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	loaderMsg: PropTypes.string.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']),
	orderBy: PropTypes.string,
	headLabel: PropTypes.array,
	onRequestSort: PropTypes.func,
	onSelectAllClick: PropTypes.func,
	emptyRows: PropTypes.number,
	isNotFound: PropTypes.bool,
	isSetLoading: PropTypes.bool,
	items: PropTypes.array,
	selected: PropTypes.array,
	filterName: PropTypes.string,
	rowsPerPage: PropTypes.number,
	page: PropTypes.number,
	onPageChange: PropTypes.func,
	onRowsPerPageChange: PropTypes.func,
	children: PropTypes.node,
}

function GenericTabs(
	{
		isLoading,
		loaderMsg,
		onSelectAllClick,
		headLabel,
		orderBy,
		order,
		onRequestSort,
		emptyRows,
		isNotFound,
		items,
		filterName,
		rowsPerPage,
		page,
		onPageChange,
		onRowsPerPageChange,
		selected,
		children,
		isSetLoading
	}
) {
	const count = useMemo(() => getLisItem(items).length, [items])
	
	if (isLoading) return <Loader text={loaderMsg}/>
	
	return <Scrollbar>
		<TableContainer sx={{minWidth: 800}}>
			<Table>
				{
					!isNotFound && <>
						<ListHead
							order={order}
							orderBy={orderBy}
							headLabel={headLabel}
							rowCount={count}
							numSelected={selected.length}
							onRequestSort={onRequestSort}
							onSelectAllClick={onSelectAllClick}
							isSetLoading={isSetLoading}
						/>
						<TableBody>
							{children}
							{emptyRows > 0
								&& (
									<TableRow style={{height: 53 * emptyRows}}>
										<TableCell colSpan={6}/>
									</TableRow>
								)}
						</TableBody>
					</>
				}
				{isNotFound &&
					(
						<TableBody>
							<TableRow>
								<TableCell align="center" colSpan={6} sx={{py: 3}}>
									<SearchNotFound searchQuery={filterName}/>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
			</Table>
		</TableContainer>
		
		<TablePagination
			rowsPerPageOptions={[5, 10, 25]}
			component="div"
			count={items.length}
			rowsPerPage={rowsPerPage}
			page={page}
			onPageChange={onPageChange}
			onRowsPerPageChange={onRowsPerPageChange}
		/>
	</Scrollbar>
}


MyTabs.propTypes = {
	items: PropTypes.array,
	head: PropTypes.array,
	isLoading: PropTypes.bool,
	isSetLoading: PropTypes.bool,
	actionsButton: PropTypes.node,
	row: PropTypes.node,
	onDeleteItems: PropTypes.func,
	onReloadData: PropTypes.func,
}


export default function MyTabs(
	{
		items,
		isLoading,
		isSetLoading,
		row,
		head,
		onReloadData,
		actionsButton,
		onDeleteItems
	}) {
	const [filterName, setFilterName] = useState('');
	const [order, setOrder] = useState('asc');
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState('id');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	
	const handleSelectAllClick = useCallback((event) => {
		if (event.target.checked) {
			const newSelecteds = getLisItem(items).map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	}, [items]);
	const handleDeleteItems = useCallback(() => {
		setSelected([])
		return onDeleteItems
	}, [onDeleteItems])
	
	const handleSelectListAllClick = useCallback((event, list) => {
		if (event.target.checked) {
			setSelected(l => Array.from(new Set([...l, ...list])));
			return;
		}
		setSelected(l => [...l.filter(i => list.indexOf(i) < 0)]);
	}, []);
	
	const handleFilterByName = useCallback((event) => {
		setFilterName(event.target.value);
	}, [])
	
	const handleRequestSort = useCallback((event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	}, [order, orderBy])
	
	
	const handleChangePage = useCallback((event, newPage) => {
		setPage(newPage);
	}, []);
	
	const handleChangeRowsPerPage = useCallback((event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	}, []);
	
	const handleClick = useCallback((id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	}, [selected]);
	
	const filteredItems = useMemo(() => applySortFilter(items, getComparator(order, orderBy), filterName), [filterName, items, order, orderBy])
	
	return <>
		<ListToolBar
			isLoading={isLoading}
			placeholder="Rechercher une texture"
			numSelected={selected.length}
			filterName={filterName}
			onFilterName={handleFilterByName}
			actionsButton={cloneElement(actionsButton, {selected, onDeleteItems: handleDeleteItems})}
		/>
		<GenericTabs
			isLoading={isLoading}
			isNotFound={filteredItems.length === 0}
			loaderMsg="Chargement des textures..."
			items={items}
			selected={selected}
			order={order}
			orderBy={orderBy}
			headLabel={head}
			filterName={filterName}
			rowsPerPage={rowsPerPage}
			page={page}
			onSelectAllClick={handleSelectAllClick}
			onRequestSort={handleRequestSort}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
			isSetLoading={isSetLoading}
		>
			{
				filteredItems
					.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
					.map(
						(item, k) => {
							const isItemSelected = selected.indexOf(item.id) !== -1;
							
							return cloneElement(
								row,
								{
									key: k,
									item,
									isItemSelected,
									isSetLoading,
									onSelected: handleClick,
									selected,
									onListSelected: handleSelectListAllClick,
									onReloadData,
									onDeleteItems
								}
							)
						}
					)
			}
		</GenericTabs>
	</>
}