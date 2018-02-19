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
		const getNumUsers = await fetch(`${functionsUrl}/getUsersCount`).then(users => users.json()).catch(e => e);
		const { registered, anonymous, unknown } = getNumUsers;
		const getNumStops = await fetch(`${functionsUrl}/getStopsCount`).then(stops => stops.json()).catch(e => e);
		const { stopsCount } = getNumStops;
		const getNumDepartures = await fetch(`${functionsUrl}/getDeparturesCount`).then(departures => departures.json()).catch(e => e);
		const { departuresCount } = getNumDepartures;
		this.setState({
			numUsers: registered + anonymous + unknown,
			numStops: stopsCount,
			numDepartures: departuresCount,
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
					: null
				}
				{userdataLoading === false && userdataError === false
					? <Users userdata={userdata} />
					: (
						<Paper
							style={{
								width: '100%', height: '417px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5em',
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
								width: '100%', height: '417px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5em',
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
								width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center',
							}}
						>
							<CircularProgress />
						</Paper>
					)
				}
			</div>
		);
	}
}

export default App;
