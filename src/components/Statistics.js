import React, { PureComponent } from 'react';
import firebase from 'firebase';
import { Paper, Toolbar, IconButton, Icon, Input } from 'material-ui';
import { LinearProgress } from 'material-ui/Progress';

const Stat = ({
    value, label, goal, children,
}) => (
    <div style={{ width: '25%' }}>
        <div
            style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
        >
            <p style={{ fontSize: '1em', margin: 0 }}>{label}</p>
            {children}
        </div>
        <LinearProgress color={goal === 100 ? 'secondary' : 'primary'} variant={value === 0 ? 'indeterminate' : 'determinate'} value={goal} />
    </div>
);

const getPercent = (num, goal) => (num === 0 ? 0 : Math.min(Math.floor((num / goal) * 100), 100));

export default class Statistics extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            userGoals: this.props.userGoals,
            stopsGoals: this.props.stopsGoals,
            departuresGoals: this.props.departuresGoals,
        };
    }

    componentWillReceiveProps({ userGoals, stopsGoals, departuresGoals }) {
        this.setState({
            userGoals,
            stopsGoals,
            departuresGoals,
        });
    }

    onChange = type => (event) => {
        this.setState({ [type]: event.target.value === '' ? 0 : parseInt(event.target.value, 10) });
    }

    onSave = (type) => {
        firebase.database().ref('stats').update({ [type]: this.state[type] })
        .catch(e => console.log(e));
    }

    toggleEdit = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    renderInput(value, type) {
        if (this.state.isEditing) {
            return (
                <Input
                    value={this.state[type]}
                    fullWidth
                    style={{ height: '37px' }}
                    onChange={this.onChange(type)}
                    endAdornment={
                        this.state[type] !== this.props[type] ?
                        (
                            <IconButton
                                aria-label="Save"
                                onClick={() => this.onSave(type)}
                            >
                                <Icon>save</Icon>
                            </IconButton>
                        ) : null
                    }
                />
            );
        }
        return <p style={{ fontSize: '2em', margin: 0, height: '37px' }}>{value === 0 ? '' : value}</p>;
    }

    render() {
        const {
            numUsers, numViewedStops, numViewedDepartures, userGoals, stopsGoals, departuresGoals,
        } = this.props;
        return (
            <Paper
                style={{
                    width: '100%', marginTop: '2.5em',
                }}
            >
                <Toolbar>
                    <div style={{ flex: '0 0 auto' }}>
                        Statistics
                    </div>
                    <div style={{ flex: '1 1 100%' }} />
                    <IconButton
                        aria-label="Edit"
                        onClick={() => this.toggleEdit()}
                    >
                        <Icon color="action">edit</Icon>
                    </IconButton>
                </Toolbar>
                <div
                    style={{
                        height: '100px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',
                    }}
                >
                    <Stat value={numUsers} label="Users" goal={getPercent(numUsers, userGoals)}>
                        {this.renderInput(numUsers, 'userGoals')}
                    </Stat>
                    <Stat value={numViewedStops} label="Viewed stops" goal={getPercent(numViewedStops, stopsGoals)}>
                        {this.renderInput(numViewedStops, 'stopsGoals')}
                    </Stat>
                    <Stat value={numViewedDepartures} label="Viewed departures" goal={getPercent(numViewedDepartures, departuresGoals)}>
                        {this.renderInput(numViewedDepartures, 'departuresGoals')}
                    </Stat>
                </div>
            </Paper>
        );
    }
}
