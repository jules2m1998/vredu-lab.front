import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useCallback, useContext, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
	Card,
	Table,
	Stack,
	Avatar,
	Button,
	Checkbox,
	TableRow,
	TableBody,
	TableCell,
	Container,
	Typography,
	TableContainer,
	TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import Loader from "../components/Loader";
import {RequestContext} from "../http/RequestProvider";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{id: 'userName', label: 'Nom d\'utilisateur', alignRight: false},
	{id: 'firstName', label: 'Nom complet', alignRight: false},
	{id: 'email', label: 'Email', alignRight: false},
	{id: 'phoneNumber', label: 'Numero de telephone', alignRight: false},
	{id: 'isActivated', label: 'Status', alignRight: false},
	{id: ''},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(array, (_user) => _user.userName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
	}
	return stabilizedThis.map((el) => el[0]);
}

export default function User() {
	const [page, setPage] = useState(0);
	
	const [isloading, setloading] = useState(false);
	const [isSetLoading, setSetLoader] = useState(false);
	const [users, setUser] = useState([])
	
	const [order, setOrder] = useState('asc');
	
	const [selected, setSelected] = useState([]);
	
	const [orderBy, setOrderBy] = useState('username');
	
	const [filterName, setFilterName] = useState('');
	
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const request = useContext(RequestContext)
	
	const toggleState = useCallback(async (id, isActivated, msg = 'utilisateur modifie avec succes !') => {
		if (msg) setSetLoader(true)
		const formData = new FormData()
		formData.append("IsActivated", `${!isActivated}`)
		formData.append("Id", id)
		const data = await request.fetch('/User/Admin', {
			method: "put",
			body: formData,
			successMsg: msg
		})
		setUser(us => [...us.filter(value => value.id !== id), data])
		if (msg) setSetLoader(false)
	}, [request])
	
	const onSetMultiple = useCallback(async (e) => {
		setSetLoader(true)
		await Promise.all(selected.map(async (id) => {
			await toggleState(id, e, null)
		}))
		setSetLoader(false)
	}, [selected, toggleState])
	
	useEffect(() => {
		setloading(true);
		request.fetch("/User").then(value => {
			if (value) setUser(value)
			setloading(false)
		})
	}, [request])
	
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = users.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	
	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	};
	
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	
	const handleFilterByName = (event) => {
		setFilterName(event.target.value);
	};
	
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
	
	const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);
	
	const isUserNotFound = filteredUsers.length === 0;
	
	return (
		<Page title="User">
			<Container>
				
				<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
					<Typography variant="h4" gutterBottom>
						Liste des utilisateur
					</Typography>
					<Button disabled={isloading} variant="contained" component={RouterLink} to="/dashboard/user/form"
					        startIcon={<Iconify icon="eva:plus-fill"/>}>
						Nouvelle utilsateur
					</Button>
				</Stack>
				
				<Card>
					<UserListToolbar
						placeholder="Recherchez un utilsateur..."
						isLoading={isloading}
						numSelected={selected.length}
						filterName={filterName} onFilterName={handleFilterByName}
						onSetMultiple={onSetMultiple}
					/>
					
					{isloading && <Loader text='Chargement des utilisateurs...'/>}
					
					{!isloading && <>
						<Scrollbar>
							<TableContainer sx={{minWidth: 800}}>
								<Table>
									<UserListHead
										order={order}
										orderBy={orderBy}
										headLabel={TABLE_HEAD}
										rowCount={users.length}
										numSelected={selected.length}
										onRequestSort={handleRequestSort}
										onSelectAllClick={handleSelectAllClick}
									/>
									<TableBody>
										{filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
											const {
												id,
												userName,
												firstName,
												lastName,
												email,
												phoneNumber,
												avatarUrl,
												isActivated
											} = row;
											const isItemSelected = selected.indexOf(id) !== -1;
											
											return (
												<TableRow
													hover
													key={id}
													tabIndex={-1}
													role="checkbox"
													selected={isItemSelected}
													aria-checked={isItemSelected}
												>
													<TableCell padding="checkbox">
														<Checkbox
															checked={isItemSelected}
															onChange={(event) => handleClick(event, id)}
															disabled={isSetLoading}
														/>
													</TableCell>
													<TableCell component="th" scope="row" padding="none">
														<Stack direction="row" alignItems="center" spacing={2}>
															<Avatar alt={userName} src={avatarUrl}/>
															<Typography variant="subtitle2" noWrap>
																{userName}
															</Typography>
														</Stack>
													</TableCell>
													<TableCell
														align="left">{firstName} {lastName.toUpperCase()}</TableCell>
													<TableCell align="left">{email}</TableCell>
													<TableCell align="left">{phoneNumber}</TableCell>
													<TableCell align="left">
														<Label variant="ghost"
														       color={isActivated ? 'success' : 'error'}>
															{sentenceCase(isActivated ? 'Actif' : "desactive")}
														</Label>
													</TableCell>
													
													<TableCell align="right">
														<UserMoreMenu id={id} isActivated={isActivated}
														              toggleState={toggleState}/>
													</TableCell>
												</TableRow>
											);
										})}
										{emptyRows > 0 && (
											<TableRow style={{height: 53 * emptyRows}}>
												<TableCell colSpan={6}/>
											</TableRow>
										)}
									</TableBody>
									
									{isUserNotFound && (
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
						</Scrollbar>
						
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={users.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</>}
				</Card>
			</Container>
		</Page>
	);
}
