import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import Reboot from 'material-ui/Reboot';
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
		};
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			console.log('auth state changed');
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
			});
		})
		.catch(e => console.log(e));
	}

	render() {
		const { showLogin, userdata } = this.state;
		return (
			<div className="App">
				<Reboot />
				{showLogin
					? <Login />
					: null
				}
				{userdata.length > 0
					? <Users userdata={userdata} />
					: null
				}
			</div>
		);
	}
}

export default App;
