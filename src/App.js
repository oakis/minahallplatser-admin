import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import Reboot from 'material-ui/Reboot';
import { CircularProgress, Paper } from 'material-ui';
import Login from './components/Login';
import Users from './components/Users';
import initFirebase from './Firebase';
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
		};
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.getUserData();
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

	render() {
		const {
			showLogin, userdata, userdataError, userdataLoading,
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
								width: '100%', height: '417px', display: 'flex', justifyContent: 'center', alignItems: 'center',
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
								width: '100%', height: '417px', display: 'flex', justifyContent: 'center', alignItems: 'center',
							}}
						>
							{userdataError}
						</Paper>
					) : null
				}
			</div>
		);
	}
}

export default App;
