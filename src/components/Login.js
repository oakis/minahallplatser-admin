import React, { Component } from 'react';
import firebase from 'firebase';
import { Input, Button } from 'material-ui';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};
	}

	handleLogin() {
		const { username, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(username, password)
        .then(() => console.log('Logged in.'))
		.catch(e => console.log(e));
	}

	render() {
		return (
            <form onSubmit={this.handleLogin} style={{ marginBottom: '1em' }}>
                <Input
                    label="username"
                    placeholder="username"
                    type="e-mail"
                    onChange={e => this.setState({ username: e.target.value })}
                    required
                />
                <Input
                    label="password"
                    placeholder="password"
                    type="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    required
                />
                <Button
                    color="primary"
                    variant="raised"
                    onClick={() => this.handleLogin()}
                >
                    Login
                </Button>
            </form>
		);
	}
}

export default Login;
