import React, { Component } from 'react';
import _ from 'lodash';
import Table, { TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from 'material-ui/Table';
import { Toolbar, IconButton, Tooltip, Paper, Icon } from 'material-ui';

const columns = [
	{ key: 'email', label: 'e-mail' },
	{ key: 'provider', label: 'provider' },
	{ key: 'lastLogin', label: 'last login' },
	{ key: 'created', label: 'created' },
	{ key: 'key', label: 'uid' },
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
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ userdata: nextProps.userdata }); // eslint-disable-line
	}

	handleClick = (event, id) => {
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

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	render() {
		const {
			order, orderBy, page, rowsPerPage, userdata, numSelected,
		} = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, userdata.length - (page * rowsPerPage));
		return (
			<Paper
				style={{ marginBottom: '2.5em' }}
			>
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
				<Table>
					<TableHead>
						<TableRow>
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
						.map(({ provider, lastLogin, key }) => {
							const isSelected = this.isSelected(key);
							return (
								<TableRow
									key={key}
									hover
									onClick={event => this.handleClick(event, key)}
									role="checkbox"
									aria-checked={isSelected}
									tabIndex={-1}
									selected={isSelected}
								>
									<TableCell>
										{provider === 'Anonymous' ? '-' : 'e-mail'}
									</TableCell>
									<TableCell>
										{provider}
									</TableCell>
									<TableCell>
										{lastLogin}
									</TableCell>
									<TableCell>
										created
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
			</Paper>
		);
	}
}

export default Users;
