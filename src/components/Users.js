import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Table, { TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from 'material-ui/Table';
import { Toolbar, IconButton, Tooltip, Paper, Icon, Checkbox } from 'material-ui';

const columns = [
	{ key: 'email', label: 'e-mail', icon: 'email' },
	{ key: 'provider', label: 'provider', icon: 'language' },
	{ key: 'lastLogin', label: 'last login', icon: 'access_time' },
	{ key: 'created', label: 'created', icon: 'date_range' },
	{ key: 'key', label: 'uid', icon: 'account_circle' },
];

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userdata: this.props.userdata || [],
			order: 'asc',
			orderBy: '',
			selected: [],
			page: 0,
			rowsPerPage: 5,
			numSelected: 0,
			editingUser: null,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ userdata: nextProps.userdata });
	}

	getProviderIcon = (provider) => {
		if (provider === 'facebook.com') {
			return (
				<svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
					<path fill="#3B5998" d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
				</svg>
			);
		} else if (provider === 'password') {
			return <Icon>email</Icon>;
		} else if (provider === 'Anonymous') {
			return <Icon>person_outline</Icon>;
		}
		return '-';
	}

	handleChange = (id) => {
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected, numSelected: newSelected.length });
	};

	handleClick = (editingUser) => {
		this.setState({ editingUser });
	};

	handleRequestSort = (property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		const userdata = _.orderBy(this.state.userdata, orderBy, order);

		this.setState({ userdata, order, orderBy });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	humanReadableDate = date => (date ? moment(date).format('MMM Do YYYY, HH:mm:ss ZZ') : '-');

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	render() {
		const {
			order, orderBy, page, rowsPerPage, userdata, numSelected, editingUser,
		} = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, userdata.length - (page * rowsPerPage));
		return (
			<Paper>
				<Toolbar
					className={numSelected > 0 ? 'highlighted' : null}
				>
					<div style={{ flex: '0 0 auto' }}>
						{numSelected > 0 ? `${numSelected} selected` : 'Users'}
					</div>
					<div style={{ flex: '1 1 100%' }} />
					<div>
						{numSelected > 0 ? (
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<Tooltip title="Delete">
								<IconButton aria-label="Delete">
									<Icon color="action">delete</Icon>
								</IconButton>
							</Tooltip>
							<Tooltip title="Edit">
								<IconButton aria-label="Edit">
									<Icon color="action">edit</Icon>
								</IconButton>
							</Tooltip>
							<Tooltip title="Email">
								<IconButton aria-label="Email">
									<Icon color="action">email</Icon>
								</IconButton>
							</Tooltip>
						</div>
						) : (
						<Tooltip title="Filter list">
							<IconButton aria-label="Filter list">
								<Icon>filter_list</Icon>
							</IconButton>
						</Tooltip>
						)}
					</div>
				</Toolbar>
				<div style={{ overflowX: 'auto' }}>
					<Table style={{ overflow: 'hidden' }}>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox" />
								{columns.map(col =>
									(
										<TableCell
											key={col.key}
											sortDirection={orderBy === col.key ? order : false}
										>
											<Tooltip
												title="Sortera"
												enterDelay={500}
											>
												<TableSortLabel
													active={orderBy === col.key}
													direction={order}
													onClick={() => this.handleRequestSort(col.key)}
													style={{ whiteSpace: 'nowrap' }}
												>
													{col.label}
												</TableSortLabel>
											</Tooltip>
										</TableCell>
									))}
							</TableRow>
						</TableHead>
						<TableBody>
							{_.chain(userdata).slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
							.map(({
								lastLogin, created, email, provider, key,
							}) => {
								const isSelected = this.isSelected(key);
								const user = {
									lastLogin, created, email, provider, key,
								};
								return (
									<TableRow
										key={key}
										hover
										onClick={() => this.handleClick(user)}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										selected={isSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isSelected}
												onChange={() => this.handleChange(key)}
												color="primary"
											/>
										</TableCell>
										<TableCell>
											{email || '-'}
										</TableCell>
										<TableCell>
											{this.getProviderIcon(provider)}
										</TableCell>
										<TableCell>
											{this.humanReadableDate(lastLogin)}
										</TableCell>
										<TableCell>
											{this.humanReadableDate(created)}
										</TableCell>
										<TableCell>
											{key}
										</TableCell>
									</TableRow>
								);
							}).value()}
							{emptyRows > 0 && (
								<TableRow style={{ height: 48 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<Toolbar>
					<Table style={{ justifyContent: 'flex-end', width: '100%', display: 'flex' }}>
						<TableFooter>
							<TableRow>
								<TablePagination
									colSpan={6}
									count={userdata.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={this.handleChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</Toolbar>
			</Paper>
		);
	}
}

export default Users;
