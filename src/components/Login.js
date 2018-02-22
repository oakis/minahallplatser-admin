import React, { Component } from 'react';
import firebase from 'firebase';
import { TextField, Button, Paper, Toolbar } from 'material-ui';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
            password: '',
            userreq: false,
            passreq: false,
		};
	}

	handleLogin = (event) => {
        event.preventDefault();
		const { username, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(username, password)
        .then(() => console.log('Logged in.'))
		.catch((e) => {
            alert(e);
            this.setState({
                userreq: username.length === 0,
                passreq: password.length === 0,
            });
        });
	}

	render() {
		return (
            <Paper>
                <Toolbar>Login</Toolbar>
                <form>
                    <TextField
                        label="username"
                        placeholder="username"
                        type="e-mail"
                        onChange={e => this.setState({ username: e.target.value, userreq: false })}
                        required
                        error={this.state.userreq}
                        style={{ margin: '24px' }}
                    />
                    <TextField
                        label="password"
                        placeholder="password"
                        type="password"
                        onChange={e => this.setState({ password: e.target.value, passreq: false })}
                        required
                        error={this.state.passreq}
                        style={{ margin: '24px' }}
                    />
                    <Button
                        color="primary"
                        variant="raised"
                        onClick={this.handleLogin}
                        style={{ margin: '24px' }}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </Paper>
		);
	}
}

export default Login;
