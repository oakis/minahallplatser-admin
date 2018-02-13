import React, { Component } from 'react';
import './App.css';
import firebase from "firebase";
import _ from 'lodash';
import initFirebase from './Firebase.js';
import Reboot from 'material-ui/Reboot';
import Table, { TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import { Input, Button, Toolbar, IconButton } from 'material-ui';

initFirebase();

const columns = ['e-mail', 'provider', 'last login', 'created', 'uid'];

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showLogin: false,
			userdata: [],
			order: 'asc',
			orderBy: '',
			selected: [],
			page: 0,
			rowsPerPage: 10,
			username: '',
			password: '',
			numSelected: 0
		};
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.getUserData();
			}
			this.setState({ showLogin: !user });
		});		  
	}

	getUserData = () => {
		firebase.database().ref('/users').once('value').then((snapshot) => {
			this.setState({
				userdata: _.map(snapshot.val(), ({ isAnonymous, lastLogin }, key) => {
					return { isAnonymous, lastLogin, key };
				})
			});
		});
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
	
		const userdata =
		  	order === 'desc'
			? this.state.userdata.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
			: this.state.userdata.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
	
		this.setState({ userdata, order, orderBy });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleLogin() {
		const { username, password } = this.state;
		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(user => {
			this.setState({ showLogin: false });
		})
		.catch(e => console.log(e));
	}

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	render() {
		const { order, orderBy, page, rowsPerPage, showLogin, userdata, numSelected } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, userdata.length - page * rowsPerPage);
		return (
			<div className="App">
				<Reboot />
				{showLogin
				? (
					<form onSubmit={this.handleLogin} style={{ marginBottom: '1em' }}>
						<Input
							label="username"
							placeholder="username"
							type="e-mail"
							onChange={(e) => this.setState({ username: e.target.value })}
							required
						/>
						<Input
							label="password"
							placeholder="password"
							type="password"
							onChange={(e) => this.setState({ password: e.target.value })}
							required
						/>
						<Button
							color={'primary'}
							variant={'raised'}
							onClick={() => this.handleLogin()}
						>
							Login
						</Button>
					</form>
				)
				: null
				}
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
					<Table>
						<TableHead>
							<TableRow>
								{columns.map((col, index) => {
									return (
										<TableCell
											key={index}
											sortDirection={orderBy === col ? order : false}
										>
											<Tooltip
												title="Sortera"
												enterDelay={500}
											>
												<TableSortLabel
													active={orderBy === col}
													direction={order}
													onClick={() => this.handleRequestSort(col)}
												>
													{col}
												</TableSortLabel>
											</Tooltip>
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{_.chain(userdata).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ isAnonymous, lastLogin, key }) => {
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
											{isAnonymous ? isAnonymous.toString() : 'false'}
										</TableCell>
										<TableCell>
											provider
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
			</div>
		);
	}
}

export default App;
