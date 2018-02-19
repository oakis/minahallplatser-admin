import React, { PureComponent } from 'react';
import { Paper } from 'material-ui';

const Stat = ({ value, label }) => (
    <div
        style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}
    >
        <p style={{ fontSize: '1em', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '2em', margin: 0 }}>{value}</p>
    </div>
);

export default class Statistics extends PureComponent {
    render() {
        const { numUsers, numViewedStops, numViewedDepartures } = this.props;
        return (
            <Paper
                style={{
                    width: '100%', height: '100px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2.5em',
                }}
            >
                <Stat value={numUsers} label="Users" />
                <Stat value={numViewedStops} label="Viewed stops" />
                <Stat value={numViewedDepartures} label="Viewed departures" />
            </Paper>
        );
    }
}
