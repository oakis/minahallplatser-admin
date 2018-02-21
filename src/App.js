import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import Reboot from 'material-ui/Reboot';
import { CircularProgress, Paper } from 'material-ui';
import green from 'material-ui/colors/green';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Login from './components/Login';
import Users from './components/Users';
import Statistics from './components/Statistics';
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

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLogin: false,
			userdata: [],
			userdataLoading: true,
			userdataError: false,
			numUsers: 0,
			numStops: 0,
			numDepartures: 0,
			userGoal: 0,
			stopGoal: 0,
			departuresGoal: 0,
		};
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
				({ isAnonymous, lastLogin }, key) => ({ provider: isAnonymous ? 'Anonymous' : 'Other', lastLogin, key }),
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
		firebase.database().ref('stats').on('value', (snapshot) => {
			const {
				userGoals, stopsGoals, departuresGoals, stopsCount, departuresCount,
			} = snapshot.val();
			this.setState({
				userGoal: userGoals,
				stopGoal: stopsGoals,
				departuresGoal: departuresGoals,
				numStops: stopsCount,
				numDepartures: departuresCount,
			});
		});
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
			userGoal,
			stopGoal,
			departuresGoal,
		} = this.state;
		return (
			<div className="App">
				<Reboot />
				<MuiThemeProvider theme={theme}>
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
								userGoal={userGoal}
								stopGoal={stopGoal}
								departuresGoal={departuresGoal}
							/>
						</div>
					)
				}
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
