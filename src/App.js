import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import Reboot from 'material-ui/Reboot';
import { CircularProgress, Paper } from 'material-ui';
import Login from './components/Login';
import Users from './components/Users';
import Statistics from './components/Statistics';
import initFirebase, { functionsUrl } from './Firebase';
import './App.css';

initFirebase();

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLogin: false,
			userdata: [],
			userdataLoading: true,
			userdataError: false,
			statisticsLoading: true,
			numUsers: 0,
			numStops: 0,
			numDepartures: 0,
		};
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.getUserData();
				this.getStatistics();
			}
			this.setState({ showLogin: !user });
		});
	}

	getUserData = () => {
		firebase.database().ref('/users').once('value').then((snapshot) => {
			this.setState({
				userdata: _.map(
					snapshot.val(),
					({ isAnonymous, lastLogin }, key) => ({ provider: isAnonymous ? 'Anonymous' : 'Other', lastLogin, key }),
				),
				userdataLoading: false,
				userdataError: false,
			});
		})
		.catch(e => this.setState({ userdataLoading: false, userdataError: e }));
	}

	getStatistics = async () => {
		const getNumUsers = await fetch(`${functionsUrl}/getUsersCount`)
			.then(data => (
				data.json().then((users) => {
					const { registered, anonymous, unknown } = users;
					return registered + anonymous + unknown;
				})
			))
			.catch((e) => {
				console.log('getNumUsers() error:', e);
				return 'n/a';
			});
		const getNumStops = await fetch(`${functionsUrl}/getStopsCount`).then(data => (
			data.json().then(stops => stops.stopsCount)
		)).catch((e) => {
			console.log('getNumstops() error:', e);
			return 'n/a';
		});
		const getNumDepartures = await fetch(`${functionsUrl}/getDeparturesCount`).then(data => (
			data.json().then(departures => departures.departuresCount)
		)).catch((e) => {
			console.log('getNumDepartures() error:', e);
			return 'n/a';
		});
		this.setState({
			numUsers: getNumUsers,
			numStops: getNumStops,
			numDepartures: getNumDepartures,
			statisticsLoading: false,
		});
	}

	render() {
		const {
			showLogin,
			userdata,
			userdataError,
			userdataLoading,
			statisticsLoading,
			numUsers,
			numStops,
			numDepartures,
		} = this.state;
		return (
			<div className="App">
				<Reboot />
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
							{statisticsLoading === false
								? (
									<Statistics
										numUsers={numUsers}
										numViewedStops={numStops}
										numViewedDepartures={numDepartures}
									/>
								)
								: (
									<Paper
										style={{
											width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2.5em',
										}}
									>
										<CircularProgress />
									</Paper>
								)
							}
						</div>
					)
				}
			</div>
		);
	}
}

export default App;
