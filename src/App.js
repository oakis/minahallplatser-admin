import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import Reboot from 'material-ui/Reboot';
import { CircularProgress, Paper, AppBar, Toolbar, IconButton, Icon } from 'material-ui';
import Menu, { MenuItem } from 'material-ui/Menu';
import green from 'material-ui/colors/green';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Login from './components/Login';
import Users from './components/Users';
import Statistics from './components/Statistics';
import Feedback from './components/Feedback';
import initFirebase from './Firebase';
import './App.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#779ECB',
            contrastText: '#fff',
        },
        secondary: {
            main: green[500],
            contrastText: '#000',
        },
    },
});

initFirebase();

const initialState = {
	showLogin: false,
	userdata: [],
	userdataLoading: true,
	userdataError: false,
	numUsers: 0,
	numStops: 0,
	numDepartures: 0,
	userGoals: 0,
	stopsGoals: 0,
	departuresGoals: 0,
	feedback: [],
	anchorEl: null,
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.getUserData();
				this.initFirebaseConnections();
			}
			this.setState({ showLogin: !user });
		});
	}

	getUserData = () => {
		firebase.database().ref('/users').once('value').then((snapshot) => {
			const userdata = _.map(
				snapshot.val(),
				({
					lastLogin, created, email, provider,
				}, key) => ({
					lastLogin, created, email, provider, key,
				}),
			);
			this.setState({
				userdata,
				userdataLoading: false,
				userdataError: false,
				numUsers: userdata.length,
			});
		})
		.catch(e => this.setState({ userdataLoading: false, userdataError: e }));
	}

	initFirebaseConnections = () => {
		firebase.database().ref().on('value', (snapshot) => {
			const { stats, feedback } = snapshot.val();
			const {
				userGoals, stopsGoals, departuresGoals, stopsCount, departuresCount,
			} = stats;
			this.setState({
				userGoals,
				stopsGoals,
				departuresGoals,
				numStops: stopsCount,
				numDepartures: departuresCount,
				feedback: _.map(feedback, (item, key) => ({ item, key })),
			});
		});
	}

	logout = () => {
		firebase.auth().signOut().then(() => this.setState(initialState));
	}

	menuClose = () => {
		this.setState({ anchorEl: null });
	}

	menuOpen = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	}

	render() {
		const {
			showLogin,
			userdata,
			userdataError,
			userdataLoading,
			numUsers,
			numStops,
			numDepartures,
			userGoals,
			stopsGoals,
			departuresGoals,
			feedback,
			anchorEl,
		} = this.state;
		return (
			<div className="App">
				<Reboot />
				<MuiThemeProvider theme={theme}>
					<AppBar position="sticky">
						<Toolbar>
							<div style={{ flex: 1 }}>
								Mina Hållplatser Admin
							</div>
							<IconButton onClick={this.menuOpen}>
								<Icon style={{ color: '#fff' }}>account_circle</Icon>
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={anchorEl !== null}
								onClose={this.menuClose}
							>
								<MenuItem onClick={this.logout}>Logout</MenuItem>
							</Menu>
						</Toolbar>
					</AppBar>
					<div style={{ padding: '2.5em 5em' }}>
						{showLogin
							? <Login />
							: (
								<div>
									{userdataLoading === false && userdataError === false
										? <Users userdata={userdata} />
										: (
											<Paper
												style={{
													width: '100%', height: '462px', display: 'flex', justifyContent: 'center', alignItems: 'center',
												}}
											>
												<CircularProgress />
											</Paper>
										)
									}
									{userdataError !== false
										? (
											<Paper
												style={{
													width: '100%', height: '462px', display: 'flex', justifyContent: 'center', alignItems: 'center',
												}}
											>
												{userdataError}
											</Paper>
										) : null
									}
									<Statistics
										numUsers={numUsers}
										numViewedStops={numStops}
										numViewedDepartures={numDepartures}
										userGoals={userGoals}
										stopsGoals={stopsGoals}
										departuresGoals={departuresGoals}
									/>
									<Feedback data={feedback} />
								</div>
							)
						}
					</div>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
