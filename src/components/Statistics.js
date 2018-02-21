import React, { PureComponent } from 'react';
import { Paper, Toolbar, IconButton, Icon } from 'material-ui';
import { LinearProgress } from 'material-ui/Progress';

const Stat = ({ value, label, goal }) => (
    <div style={{ width: '25%' }}>
        <div
            style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
        >
            <p style={{ fontSize: '1em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '2em', margin: 0, height: '37px' }}>{value === 0 ? '' : value}</p>
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
        };
    }

    toggleEdit = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    render() {
        const {
            numUsers, numViewedStops, numViewedDepartures, userGoal, stopGoal, departuresGoal,
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
                    <Stat value={numUsers} label="Users" goal={getPercent(numUsers, userGoal)} />
                    <Stat value={numViewedStops} label="Viewed stops" goal={getPercent(numViewedStops, stopGoal)} />
                    <Stat value={numViewedDepartures} label="Viewed departures" goal={getPercent(numViewedDepartures, departuresGoal)} />
                </div>
            </Paper>
        );
    }
}
