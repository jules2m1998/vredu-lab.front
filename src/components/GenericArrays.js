import {
	Box,
	Checkbox,
	IconButton,
	InputAdornment,
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
import {cloneElement, useCallback, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {styled} from "@mui/material/styles";
import Iconify from "./Iconify";
import Loader from "./Loader";
import Scrollbar from "./Scrollbar";
import SearchNotFound from "./SearchNotFound";
import {applySortFilter, getComparator} from "../utils/object";

const RootStyle = styled(Toolbar)(({theme}) => ({
	height: 96,
	display: 'flex',
	justifyContent: 'space-between',
	padding: theme.spacing(0, 1, 0, 3),
}));

/**
 *
 * @param items
 * @returns {Array}
 */
const getLisItem = (items) => {
	if (!Array.isArray(items[0]?.data)) return items
	
	return items.reduce((acc, val) => [...acc, ...val.data], [])
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
				<Box>
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
		onRequestSort
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
									<Box sx={{...visuallyHidden}}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
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
	}
) {
	const count = useMemo(() => getLisItem(items).length, [items])
	
	if (isLoading) return <Loader text={loaderMsg}/>
	
	return <Scrollbar>
		<TableContainer sx={{minWidth: 800}}>
			<Table>
				<ListHead
					order={order}
					orderBy={orderBy}
					headLabel={headLabel}
					rowCount={count}
					numSelected={selected.length}
					onRequestSort={onRequestSort}
					onSelectAllClick={onSelectAllClick}
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
	row: PropTypes.node
}


export default function MyTabs({items, isLoading, isSetLoading, row, head}) {
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
		/>
		<GenericTabs
			isLoading={isLoading}
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
									onListSelected: handleSelectListAllClick
								}
							)
						}
					)
			}
		</GenericTabs>
	</>
}